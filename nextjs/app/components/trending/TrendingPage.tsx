"use client";
import { useState, useEffect } from "react";
import TrendingCard from "./TrendingCard";
import { Article } from "@/lib/definitions";

export default function TrendingPage() {
    const [trendingArticles, setTrendingArticles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("api/articles/trending");
                if (!response.ok) {
                    throw new Error(`Status: ${response.status}`);
                }
                const result = await response.json();
                setTrendingArticles(result.results);
            } catch (err) {
                setTrendingArticles([]);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="px-5 bg-gray-100 pb-10 text-black min-h-screen bg-white">
            <div className="flex justify-between align-center">
                <h1 className="text-2xl font-semibold py-5">Trending News</h1>
            </div>
            {trendingArticles === undefined || trendingArticles.length === 0 ? (
                <div className="flex items-center w-screen justify-center">
                    <span className="loading loading-infinity loading-xl text-primary h-180 w-120"></span>
                </div>
            ) : (
                <div>
                    {trendingArticles.map((article: Article) => (
                        <TrendingCard article={article} key={article.id} />
                    ))}
                </div>
            )}
        </div>
    );
}
