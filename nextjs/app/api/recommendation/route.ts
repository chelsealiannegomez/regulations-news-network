import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stopWords } from "@/lib/stopwords";
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

const cosineSimilarity = (a: number[], b: number[]): number => {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(a.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (normA * normB);
};

const recencyWeight = (daysOld: number, decayRate = 0.1): number => {
    return Math.exp(-decayRate * daysOld);
};

const getQueryEmbedding = (
    query: string,
    word2int: Record<string, number>,
    embeddingMatrix: number[][]
): number[] | null => {
    const cleanedWords = query
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word && !stopWords.has(word));

    const indices = cleanedWords
        .map((word) => word2int[word])
        .filter((index) => index && index > 0);

    if (indices.length === 0) return null;

    const embeddingSize = embeddingMatrix[0].length;
    const meanVector = Array(embeddingSize).fill(0);

    indices.forEach((i) => {
        embeddingMatrix[i].forEach((v, j) => {
            meanVector[j] += v;
        });
    });

    return meanVector.map((v) => v / indices.length);
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

export const POST = async (request: NextRequest, res: NextResponse) => {
    const { query, locations } = await request.json();

    if (!query || !locations) {
        return NextResponse.json(
            { message: "Missing query/location" },
            { status: 401 }
        );
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
            const finalScore = similarity * 0.8 + recencyWeight(daysOld) * 0.2;

            scoredArticles.push({ id: article_id, score: finalScore });
        }

        scoredArticles.sort((a, b) => b.score - a.score).map((a) => a.id);

        return NextResponse.json({ results: scoredArticles }, { status: 200 });
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
