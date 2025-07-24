import prisma from "@/lib/prisma";
import { Article } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    const { locations } = await request.json();
    try {
        const articles = await prisma.article.findMany();

        if (!articles) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const userLocations = new Set(
            locations.split(",").map((loc: string) => loc.trim())
        );

        const articlesToDisplay: Article[] = [];

        for (const article of articles) {
            const articleLocations = new Set(
                article.location.split(",").map((loc: string) => loc.trim())
            );
            const hasMatch = [...articleLocations].some((item) =>
                userLocations.has(item)
            );

            if (hasMatch) {
                articlesToDisplay.push(article);
            }
        }

        articlesToDisplay.sort(
            (a, b) =>
                new Date(b.date_posted).getTime() -
                new Date(a.date_posted).getTime()
        );

        return NextResponse.json(
            { articles: articlesToDisplay },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
