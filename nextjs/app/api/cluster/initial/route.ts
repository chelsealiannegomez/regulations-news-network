import { NextRequest, NextResponse } from "next/server";
import { kMeans } from "@/app/utils/clustering";
import { Pool } from "pg";
import dotenv from "dotenv";

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
    const client = await pool.connect();
    const maxIterations = 20;
    try {
        const result = await client.query("SELECT * FROM embeddings;");

        if (!result) {
            return NextResponse.json(
                { message: "Articles not found" },
                { status: 401 }
            );
        }

        const structuredArticles = result.rows.map((a) => ({
            article_id: a.article_id,
            vector: JSON.parse(a.vector) as number[],
            cluster: a.cluster,
        }));
        const results = kMeans(structuredArticles, 5, 20);

        for (const row of results) {
            const query =
                "UPDATE embeddings SET cluster=$1 WHERE article_id=$2";
            const values = [row.cluster, row.article_id];
            await client.query(query, values);
        }

        return NextResponse.json(
            {
                results: results.map((a) => ({
                    article_id: a.article_id,
                    cluster: a.cluster,
                })),
            },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
