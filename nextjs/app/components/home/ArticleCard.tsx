import { useState } from "react";
import { Article } from "@/lib/definitions";

function parseArticleContent(input: string): string[] {
    let trimmed = input.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        trimmed = trimmed.slice(2, -2);
    }

    const newTrimmed = trimmed.replaceAll('\\"', '"');

    return newTrimmed.split('","');
}

export default function ArticleCard({ article }: { article: Article }) {
    const [seeMore, setSeeMore] = useState<Boolean>(false);

    const articleContent = parseArticleContent(article.content);

    return (
        <div className="border rounded mb-5 px-5 py-3">
            <a
                href={article.url}
                className="text-lg font-semibold hover:underline"
                target="_blank"
            >
                <h2>{article.title}</h2>
            </a>
            {/* <p>{article.location}</p> */}
            <p className="italic mb-2">{article.date_posted}</p>

            {!seeMore ? (
                <div>
                    <p>{article.description}</p>
                    <button
                        onClick={() => setSeeMore(true)}
                        className="bg-gray-200 px-5 rounded-md mt-3"
                    >
                        Read more
                    </button>
                </div>
            ) : (
                // <p>{articleContent}</p>
                <div key={article.id}>
                    {articleContent.map((paragraph, index) => (
                        <p className="mt-5">{paragraph}</p>
                    ))}
                    <button
                        onClick={() => setSeeMore(false)}
                        className="bg-gray-200 px-5 rounded-md mt-3"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
}
