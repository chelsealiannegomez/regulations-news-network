import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
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

export const POST = async (request: NextRequest) => {
    const { query, locations, user_id, rate } = await request.json();

    if (!query || !locations) {
        return NextResponse.json(
            { message: "Missing query/location" },
            { status: 401 }
        );
    }
    const logs = await getAllUserLogs(user_id);

    const map = new Map();

    if (logs) {
        for (const log of logs) {
            if (map.has(log.article_id)) {
                map.set(log.article_id, map.get(log.article_id) + 1);
            } else {
                map.set(log.article_id, 1);
            }
        }
    }

    loadEmbeddings();
    const queryVector = getQueryEmbedding(query, word2int, wordEmbeddings);

    const client = await pool.connect();

    try {
        const result = await client.query(
            'SELECT date_posted, location, article_id, vector FROM "Article" INNER JOIN embeddings ON "Article".id = embeddings.article_id;'
        );

        const userLocations = new Set(
            locations.split(",").map((loc: string) => loc.trim())
        );
        const scoredArticles: { id: number; score: number }[] = [];

        for (const row of result.rows) {
            const { date_posted, location, article_id, vector } = row;
            const articleVector = JSON.parse(vector) as number[];
            const articleLocations = new Set(
                location.split(",").map((loc: string) => loc.trim())
            );
            const hasMatch = [...articleLocations].some((item) =>
                userLocations.has(item)
            );

            if (!hasMatch) {
                continue;
            }

            const daysOld =
                (Date.now() - new Date(date_posted).getTime()) /
                (1000 * 60 * 60 * 24);
            const similarity = cosineSimilarity(
                queryVector ?? [],
                articleVector
            );

            const articleSeenWeight = getArticleSeenWeight(map.get(article_id));

            const finalScore =
                similarity * rate +
                recencyWeight(daysOld) * ((1 - rate) / 2) +
                articleSeenWeight * ((1 - rate) / 2);

            scoredArticles.push({ id: article_id, score: finalScore });
        }

        scoredArticles.sort((a, b) => b.score - a.score);

        return NextResponse.json(
            { results: scoredArticles.map((a) => a.id) },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 401 }
        );
    } finally {
        client.release();
    }
};
