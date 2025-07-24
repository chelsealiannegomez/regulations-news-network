import { NextResponse, NextRequest } from "next/server";
import getArticleIds from "@/app/utils/getArticleIds";

export const POST = async (request: NextRequest) => {
    const { page_num, num_articles_per_page, locations } = await request.json();
    try {
        const data = await fetch(
            `${process.env.DOMAIN}/api/articles/filter_locations`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    locations: locations,
                }),
            }
        );

        const response = await data.json();

        if (!response) {
            return NextResponse.json(
                { message: "No array returned" },
                { status: 401 }
            );
        }

        const ordered_articles = response.articles;

        const articles = [];

        const maxPageNum = Math.ceil(
            ordered_articles.length / num_articles_per_page
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
            ordered_articles.length
        );

        for (let i = firstId; i < lastId + 1; i++) {
            articles.push(ordered_articles[i]);
        }

        return NextResponse.json(
            { articles: articles, total_articles: ordered_articles.length },
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
