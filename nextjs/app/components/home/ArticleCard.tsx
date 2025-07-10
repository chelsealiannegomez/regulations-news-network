import { useState } from "react";
import { Article } from "@/lib/definitions";
import { parseArticleContent } from "@/app/utils/parseArticle";

export default function ArticleCard({ article }: { article: Article }) {
    const [seeMore, setSeeMore] = useState<boolean>(false);

    const articleContent = parseArticleContent(article.content);

    const date = new Date(article.date_posted).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });

    return (
        <div className="border rounded-xl mb-5 px-7 py-5 bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-white">
            <a
                href={article.url}
                className="text-lg font-semibold hover:underline"
                target="_blank"
            >
                <h2>{article.title}</h2>
            </a>
            <p className="italic mb-4">{date}</p>

            {!seeMore ? (
                <div>
                    <p>{article.description}</p>
                    <button
                        onClick={() => setSeeMore(true)}
                        className="bg-gray-200 px-5 rounded-md mt-3 duration-500 transition-[background-color] hover:bg-gray-400 cursor-pointer"
                    >
                        Read more
                    </button>
                </div>
            ) : (
                <div key={article.id}>
                    {articleContent.map((paragraph, index) => (
                        <p className="mt-5" key={index}>
                            {paragraph}
                        </p>
                    ))}
                    <button
                        onClick={() => setSeeMore(false)}
                        className="bg-gray-200 px-5 rounded-md mt-3 duration-500 transition-[background-color] hover:bg-gray-400 cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}
