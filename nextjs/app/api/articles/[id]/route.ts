import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) => {
    const { id } = await context.params;

    try {
        const article = await prisma.article.findUnique({
            where: { id: parseInt(id) },
        });

        if (!article) {
            return NextResponse.json(
                { message: "Article not found" },
                { status: 401 }
            );
        }
        return NextResponse.json({ article: article }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
