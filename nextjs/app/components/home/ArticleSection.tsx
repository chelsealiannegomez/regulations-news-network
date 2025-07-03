"use client";
import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { User, Article } from "@/lib/definitions";
import { parsePreferences } from "@/app/utils/parsePreferences";

type HomePageProps = {
    user: User;
};

export default function ArticleSection({ user }: HomePageProps) {
    const [query, setQuery] = useState<string>("");

    const [articles, setArticles] = useState<Article[]>([]);

    const [orderedArticles, setOrderedArticles] = useState<Article[]>([
        ...articles,
    ]);

    useEffect(() => {
        fetch("api/articles")
            .then((res) => res.json())
            .then((data) => {
                setArticles(data.articles);
            });
    }, []);

    useEffect(() => {
        let userQuery = "";
        if (user.preferences) {
            setQuery(parsePreferences(user.preferences).display);
            userQuery = parsePreferences(user.preferences).query;
        }

        fetch(
            "https://fastapi-recommendation-model.onrender.com/recommendation_model",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: userQuery }),
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (articles) {
                    const idToObjectMap = new Map();
                    articles.forEach((article) => {
                        idToObjectMap.set(article.id, article);
                    });

                    const ordered = data.results.map((id: number) =>
                        idToObjectMap.get(id)
                    );

                    setOrderedArticles(ordered);
                }
            });
    }, [articles, user]);

    return (
        <div className="px-5 bg-gray-100">
            <div className="text-2xl font-semibold py-5">News for You</div>
            <p className="mb-3">Showing results for: {query}</p>
            {orderedArticles[0] === undefined ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {orderedArticles.map((article) => (
                        <ArticleCard article={article} key={article.id} />
                    ))}
                </div>
            )}
        </div>
    );
}
