import { NextRequest, NextResponse } from "next/server";
import { assignCluster } from "@/app/utils/clustering";
import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

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

export const GET = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) => {
    const { id } = await context.params;
    const client = await pool.connect();

    const filePath = path.resolve(__dirname, "centroids.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");

    const centroids = JSON.parse(jsonData);
    try {
        const result = await client.query(
            "SELECT * FROM embeddings WHERE article_id=$1;",
            [id]
        );

        if (!result) {
            return NextResponse.json(
                { message: "Article not found" },
                { status: 401 }
            );
        }

        const structuredArticles = result.rows.map((a) => ({
            article_id: a.article_id,
            vector: JSON.parse(a.vector) as number[],
            cluster: a.cluster,
        }));
        const results = assignCluster(structuredArticles, centroids);

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
