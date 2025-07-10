import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    const { query, page_num, num_articles_per_page, locations } =
        await request.json();
    try {
        const articles = await fetch(
            `${process.env.FASTAPI_DOMAIN}/page_ordered_articles`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: query,
                    page_num: page_num,
                    num_articles_per_page: num_articles_per_page,
                    locations: locations,
                }),
            }
        );

        const data = await articles.json();

        if (!data) {
            return NextResponse.json(
                { message: "No articles returned" },
                { status: 401 }
            );
        }

        return NextResponse.json({ articles: data }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
};
