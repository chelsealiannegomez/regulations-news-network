"use client";
import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { User, Article } from "@/lib/definitions";

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
        <div className="mx-5">
            <div className="text-2xl font-semibold my-5">News for You</div>
            {articles.map((article) => (
                <ArticleCard article={article} key={article.id} />
            ))}
        </div>
    );
}
