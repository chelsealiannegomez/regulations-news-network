import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) => {
    const { id } = await context.params;

    try {
        const existing = await prisma.mailingList.findFirst({
            where: { user_id: parseInt(id) },
        });

        if (existing) {
            return NextResponse.json(
                { message: "Already in mailing list" },
                { status: 409 }
            );
        }

        const newEntry = await prisma.mailingList.create({
            data: {
                user_id: parseInt(id),
            },
        });

        return NextResponse.json(
            { message: "Successfully added user to mailing list" },
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
