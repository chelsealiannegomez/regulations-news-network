import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
export const GET = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) => {
    const { id } = await context.params;
    try {
        const result = await prisma.$queryRaw`
        SELECT a.title, a.url FROM embeddings e INNER JOIN "Article" a ON e.article_id = a.id WHERE e.cluster = (SELECT cluster FROM embeddings WHERE article_id =${parseInt(
            id
        )})
        AND e.article_id != ${parseInt(id)}
        ORDER BY RANDOM()
        LIMIT 3;`;
        return NextResponse.json({ result: result }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ result: [] }, { status: 404 });
    }
};
