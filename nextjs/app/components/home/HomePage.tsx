"use client";
import { User, Article } from "@/lib/definitions";
import { useState, useEffect } from "react";

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
            <header className="h-20 flex justify-center items-center text-xl">
                Regulations News Network
            </header>
            <div className="mx-5">
                <p className="mb-5">Welcome, {user.firstName}</p>
                {articles.map((article) => (
                    <p key={article.id}>{article.title}</p>
                ))}
            </div>
        </div>
    );
}
