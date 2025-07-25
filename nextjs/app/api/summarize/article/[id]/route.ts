import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const GET = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) => {
    const { id } = await context.params;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        tools: [
            {
                codeExecution: {},
            },
        ],
    });

    try {
        const article = await prisma.article.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (article) {
            if (article.summary !== "") {
                return NextResponse.json(
                    {
                        message: `Article already has summary`,
                    },
                    { status: 409 }
                );
            }
            const prompt = `Summarize the following privacy news article in 4 sentences. Only include what is explicitly written in the article: ${article.content}`;

            const result = await model.generateContent(prompt);

            const text = result.response.text();

            const updatedArticle = await prisma.article.update({
                where: { id: parseInt(id) },
                data: {
                    summary: text,
                },
            });
            return NextResponse.json(
                {
                    message: `Succesfully added summaries`,
                },
                { status: 201 }
            );
        } else {
            return NextResponse.json(
                {
                    message: "Article not found",
                },
                { status: 404 }
            );
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Something went wrong: ", err },
            { status: 401 }
        );
    }
};
