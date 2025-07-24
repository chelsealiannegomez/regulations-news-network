import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import dotenv from "dotenv";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

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

export const GET = async (request: NextRequest) => {
    const { id } = await request.json();
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
        tools: [
            {
                codeExecution: {},
            },
        ],
    });

    const client = await pool.connect();

    try {
        const article = await prisma.article.findUnique({
            where: {
                id: id,
            },
        });

        if (article) {
            const prompt = `Summarize the following privacy news article in 4 sentences. Only include what is explicitly written in the article: ${article.content}`;

            const result = await model.generateContent(prompt);

            const text = result.response.text();

            const updatedArticle = await prisma.article.update({
                where: { id: id },
                data: {
                    summary: text,
                },
            });
            return NextResponse.json(
                {
                    message: `Succesfully added summaries`,
                },
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                {
                    message: "Article not found",
                },
                { status: 404 }
            );
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong: ", err },
            { status: 401 }
        );
    } finally {
        client.release();
    }
};
