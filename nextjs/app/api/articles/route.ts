import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const articles = await prisma.article.findMany();

        if (!articles) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        return NextResponse.json({ articles: articles }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
