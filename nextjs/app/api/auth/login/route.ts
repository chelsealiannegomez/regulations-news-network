import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/bcrypt";
import { createSession } from "@/lib/session";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    const { email, password } = await request.json();

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Email is not yet registered" },
                { status: 404 }
            );
        }

        const successfulLogin = await verifyPassword(password, user.password);

        if (successfulLogin) {
            await createSession(user.id);
            return NextResponse.json(
                { message: "Successfully logged in!" },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
