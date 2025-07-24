import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    const { email, password, firstName, lastName } = await request.json();
    try {
        const articles = await prisma.article.findMany({
            where: {
                location: {},
            },
        });

        if (!articles) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        return NextResponse.json({ articles: articles }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
