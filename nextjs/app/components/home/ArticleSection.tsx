"use client";
import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { Article } from "@/lib/definitions";

export default function ArticleSection() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        fetch("api/articles")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setArticles(data.articles);
            });
    }, []);
    return (
        <div className="px-5 bg-gray-100">
            <div className="text-2xl font-semibold py-5">News for You</div>
            {articles.map((article) => (
                <ArticleCard article={article} key={article.id} />
            ))}
        </div>
    );
}
