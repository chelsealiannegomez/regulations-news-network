"use client";
import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { Article } from "@/lib/definitions";
import { parsePreferences } from "@/app/utils/parsePreferences";
import Pagination from "./Pagination";
import type { HomePageProps } from "@/lib/types";

enum SortMode {
    Relevance,
    DatePosted,
}

export default function ArticleSection({ user }: HomePageProps) {
    const [query, setQuery] = useState<string>("");

    const [totalPages, setTotalPages] = useState<number>(1);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [currentPageArticles, setCurrentPageArticles] = useState<Article[]>(
        []
    );

    const [numArticles, setNumArticles] = useState<number>(0);

    const [sortMode, setSortMode] = useState<SortMode>(SortMode.Relevance);

    console.log("env", process.env.NUM_ARTICLES_PER_PAGE);

    const NUM_ARTICLES_PER_PAGE = process.env.NUM_ARTICLES_PER_PAGE
        ? process.env.NUM_ARTICLES_PER_PAGE
        : 4;

    useEffect(() => {
        let userQuery = "";
        if (user.preferences) {
            setQuery(parsePreferences(user.preferences).display);
            userQuery = parsePreferences(user.preferences).query;
        }

        fetch("api/articles/ordered", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: userQuery,
                page_num: currentPage,
                num_articles_per_page: NUM_ARTICLES_PER_PAGE,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setCurrentPageArticles(data.articles.results);
                console.log(data.articles.results);
                setTotalPages(
                    Math.ceil(
                        data.articles.total_articles / NUM_ARTICLES_PER_PAGE
                    )
                );
                setNumArticles(data.articles.total_articles);
            });
    }, [currentPage, user.preferences]);

    const handleSort = () => {
        setCurrentPage(1);
        if (sortMode === SortMode.Relevance) {
            setSortMode(SortMode.DatePosted);
        } else {
            setSortMode(SortMode.Relevance);
        }
    };

    console.log("current page", currentPage);

    return (
        <div className="px-5 bg-gray-100 pb-10">
            <div className="flex justify-between align-center">
                <h1 className="text-2xl font-semibold py-5">News for You</h1>
                <div
                    onClick={handleSort}
                    className="bg-gray-200 h-2/3 p-2 rounded-xl border border-gray-400 shadow-md hover:bg-gray-300 cursor-pointer my-auto"
                >
                    {sortMode === SortMode.Relevance
                        ? "Sort by Relevance"
                        : "Sort by Date Posted"}
                </div>
            </div>
            <p className="mb-3">Showing results for: {query}</p>
            {currentPageArticles === undefined ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {currentPageArticles.map((article) => (
                        <ArticleCard article={article} key={article.id} />
                    ))}
                    <div className="flex">
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalArticles={numArticles}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
