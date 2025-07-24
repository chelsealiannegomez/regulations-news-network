import { useState } from "react";
import { ArticleCardProps } from "@/lib/types";

export default function ArticleCard({ article, user }: ArticleCardProps) {
    const [seeMore, setSeeMore] = useState<boolean>(false);

    const date = new Date(article.date_posted).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });

    const locations = article.location.split(", ");

    const onSeeMore = async () => {
        setSeeMore(true);

        try {
            const response = await fetch("/api/log", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    article_id: article.id,
                }),
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="border rounded-xl mb-5 px-7 py-5 bg-gray-50 border-gray-200 hover:border-gray-400 hover:bg-white relative">
            <a
                href={article.url}
                className="text-lg font-semibold hover:underline"
                target="_blank"
            >
                <h2 className="text-xl">{article.title}</h2>
            </a>
            <p className="italic mb-4">{date}</p>

            {article.location ? (
                <div className="absolute bottom-5 right-8 flex">
                    {locations.map((loc) => (
                        <div
                            key={locations.indexOf(loc)}
                            className="bg-green-100 px-3 py-1 rounded-xl ml-3"
                        >
                            {loc}
                        </div>
                    ))}
                </div>
            ) : null}

            {!seeMore ? (
                <div>
                    <p className="text-lg">{article.description}</p>
                    <button
                        onClick={onSeeMore}
                        className="bg-gray-200 px-5 rounded-md mt-3 duration-500 transition-[background-color] hover:bg-gray-400 cursor-pointer"
                    >
                        Read more
                    </button>
                </div>
            ) : (
                <div key={article.id}>
                    {article.content.map((paragraph, index) => (
                        <p className="mt-5 text-lg" key={index}>
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
