import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import getArticleIds from "@/app/utils/getArticleIds";

export const POST = async (request: NextRequest) => {
    const { query, page_num, num_articles_per_page, locations, user_id } =
        await request.json();
    try {
        console.log(query, locations);
        const data = await fetch(`${process.env.DOMAIN}/api/recommendation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: query,
                locations: locations,
                user_id: user_id,
            }),
        });

        const response = await data.json();

        if (!response) {
            return NextResponse.json(
                { message: "No array returned" },
                { status: 401 }
            );
        }

        const ordered_ids = response.results;

        const articles = [];

        const maxPageNum = Math.ceil(
            ordered_ids.length / num_articles_per_page
        );

        if (page_num > maxPageNum || page_num < 1) {
            return NextResponse.json(
                { message: "Page number is invalid" },
                { status: 404 }
            );
        }

        const [firstId, lastId] = getArticleIds(
            page_num,
            num_articles_per_page,
            ordered_ids.length
        );

        for (let i = firstId; i < lastId + 1; i++) {
            const article = await prisma.article.findUnique({
                where: { id: parseInt(ordered_ids[i]) },
            });
            articles.push(article);
        }

        return NextResponse.json(
            { articles: articles, total_articles: ordered_ids.length },
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
