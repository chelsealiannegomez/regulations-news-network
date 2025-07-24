import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export const PATCH = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) => {
    const { locations } = await request.json();
    const { id } = await context.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 409 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                locations,
            },
        });

        return NextResponse.json(
            {
                message: `Succesfully changed location preferences of ${updatedUser.firstName}`,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 401 }
        );
    }
};
