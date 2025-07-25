// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import { Article } from "@prisma/client";
import { Pool } from "pg";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import {
    cosineSimilarity,
    recencyWeight,
    getQueryEmbedding,
    getAllUserLogs,
    getArticleSeenWeight,
} from "@/app/utils/queryHelpers";

dotenv.config();

let wordEmbeddings: number[][] = [];
let word2int: Record<string, number> = {};

const loadEmbeddings = () => {
    if (wordEmbeddings.length === 0) {
        const csvData = fs.readFileSync(
            path.join(process.cwd(), "public", "word_embeddings.csv"),
            "utf-8"
        );
        const rawRecords = parse(csvData, {
            columns: false,
            cast: (value: string) => parseFloat(value),
        }) as (number | string)[][];

        const records: number[][] = rawRecords.map((row) =>
            row.map((cell) => Number(cell))
        );

        wordEmbeddings = records;
    }
    if (Object.keys(word2int).length === 0) {
        const jsonData = fs.readFileSync(
            path.join(process.cwd(), "public", "word2int.json"),
            "utf-8"
        );
        word2int = JSON.parse(jsonData);
    }
};

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getArticlesLast7Days = async () => {
    try {
        const daysSinceSeen = new Date();
        daysSinceSeen.setDate(daysSinceSeen.getDate() - 7);
        const articles: Article[] = await prisma.article.findMany({
            where: {
                date_posted: {
                    gte: daysSinceSeen,
                },
            },
        });
        return articles;
    } catch (err) {
        return [];
    }
};

const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT || "5432"),
    ssl: {
        rejectUnauthorized: false,
    },
});

const rankArticles = async (query: string, articles: Article[]) => {
    loadEmbeddings();

    const queryVector = getQueryEmbedding(query, word2int, wordEmbeddings);

    const client = await pool.connect();

    const ids = articles.map((a) => a.id);

    const placeholder = ids.map((_, i) => `$${i + 1}`).join(",");

    const sqlQuery = `SELECT article_id, vector FROM embeddings WHERE article_id IN (${placeholder});`;

    const result = await client.query(sqlQuery, ids);

    const scoredArticles: { id: number; score: number }[] = [];

    for (const row of result.rows) {
        const { article_id, vector } = row;
        const articleVector = JSON.parse(vector) as number[];

        const similarity = cosineSimilarity(queryVector ?? [], articleVector);

        scoredArticles.push({ id: article_id, score: similarity });
    }
    scoredArticles.sort((a, b) => b.score - a.score);

    const lookupMap = new Map(articles.map((obj) => [obj.id, obj]));

    const rankedArticles = scoredArticles.map(({ id }) => lookupMap.get(id));

    client.release();

    return rankedArticles;
};

const createContent = async (query: string, firstName: string) => {
    const articles = await getArticlesLast7Days();

    const rankedArticles = await rankArticles(query, articles);

    let html = `<h2>Hello, ${firstName}!</h2> <h4>Ready to dive into this week’s top privacy news and insights?</h4><br>`;

    for (const article of rankedArticles) {
        if (article) {
            let content = "";
            content += `<h1>${article.title}</h1>`;
            content += `<p>${article.summary}<p>`;
            content += `<br>`;
            html += content;
        }
    }
    return html;
};

export const POST = async (request: NextRequest) => {
    const { firstName, email, query } = await request.json();

    const html = await createContent(query, firstName);

    const msg = {
        to: email,
        from: "news@regulationsnewsnetwork.online",
        subject: "Regulations News Network - Weekly Update",
        text: "Regulations News Network - Weekly Update",
        html: html,
    };
    try {
        await sgMail.send(msg);
        return NextResponse.json({ message: "Email sent" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
