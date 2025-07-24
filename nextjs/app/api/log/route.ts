import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    const { user_id, article_id } = await request.json();

    try {
        const newLog = await prisma.log.create({
            data: {
                user_id: user_id,
                article_id: article_id,
            },
        });

        return NextResponse.json(
            { message: "Successfully added log" },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 401 }
        );
    }
};
