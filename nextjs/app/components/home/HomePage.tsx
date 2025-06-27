"use client";
import { User, Article } from "@/lib/definitions";
import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";

type HomePageProps = {
    user: User;
};

export default function HomePage({ user }: HomePageProps) {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        fetch("api/articles")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setArticles(data.articles);
            });
    }, []);

    console.log(setArticles);

    return (
        <div>
            <header className="h-20 flex justify-center items-center text-2xl">
                Regulations News Network
            </header>
            <div className="mx-5">
                <p className="mb-5 text-xl">Welcome, {user.firstName}</p>
                {articles.map((article) => (
                    <ArticleCard article={article} key={article.id} />
                ))}
            </div>
        </div>
    );
}
