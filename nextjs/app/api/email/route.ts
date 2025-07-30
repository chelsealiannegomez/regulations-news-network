import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const GET = async (request: NextRequest) => {
    // const { firstName, email, query } = await request.json();

    try {
        const subscribedUsers = await prisma.mailingList.findMany();

        for (const subscribedUser of subscribedUsers) {
            const user = await prisma.user.findUnique({
                where: { id: subscribedUser.user_id },
            });

            if (!user) {
                return NextResponse.json(
                    { message: "User not found" },
                    { status: 404 }
                );
            }

            const data = await fetch(`${process.env.DOMAIN}/api/email/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: user.preferences.join(","),
                    firstName: user.firstName,
                    email: user.email,
                }),
            });

            const response = await data.json();
        }
        return NextResponse.json({ message: "Emails sent" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
