"use client";
import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { Article } from "@/lib/definitions";
import Pagination from "./Pagination";
import type { HomePageProps } from "@/lib/types";
import { envClientSchema } from "@/lib/clientEnvSchema";
import parseLocations from "@/app/utils/parseLocations";

enum SortMode {
    Relevance,
    DatePosted,
}

export default function ArticleSection({ user }: HomePageProps) {
    const NUM_ARTICLES_PER_PAGE =
        envClientSchema.NEXT_PUBLIC_NUM_ARTICLES_PER_PAGE;

    const [query, setQuery] = useState<string>("");

    const [totalPages, setTotalPages] = useState<number>(1);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [currentPageArticles, setCurrentPageArticles] = useState<Article[]>();

    const [numArticles, setNumArticles] = useState<number>(0);

    const [sortMode, setSortMode] = useState<SortMode>(SortMode.Relevance);

    useEffect(() => {
        setCurrentPageArticles(undefined);
        let userQuery = "";
        console.log(user.preferences);
        if (user.preferences) {
            userQuery = user.preferences.join(" and ");
            setQuery(user.preferences.join(", "));
        }

        const userLocations = parseLocations(
            user.locations ? user.locations : []
        );

        if (sortMode === SortMode.Relevance) {
            fetch("api/articles/relevance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: userQuery,
                    page_num: currentPage,
                    num_articles_per_page: NUM_ARTICLES_PER_PAGE,
                    locations: userLocations,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Data", data);
                    setCurrentPageArticles(data.articles);
                    setTotalPages(
                        Math.ceil(data.total_articles / NUM_ARTICLES_PER_PAGE)
                    );
                    setNumArticles(data.total_articles);
                });
        } else if (sortMode === SortMode.DatePosted) {
            fetch("api/articles/date_posted", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    page_num: currentPage,
                    num_articles_per_page: NUM_ARTICLES_PER_PAGE,
                    locations: userLocations,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setCurrentPageArticles(data.articles.results);
                    setTotalPages(
                        Math.ceil(
                            data.articles.total_articles / NUM_ARTICLES_PER_PAGE
                        )
                    );
                    setNumArticles(data.articles.total_articles);
                });
        }
    }, [
        currentPage,
        user.preferences,
        sortMode,
        NUM_ARTICLES_PER_PAGE,
        user.locations,
    ]);

    const handleSort = () => {
        setCurrentPage(1);
        if (sortMode === SortMode.Relevance) {
            setSortMode(SortMode.DatePosted);
        } else {
            setSortMode(SortMode.Relevance);
        }
    };

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
                <div className="flex items-center w-screen justify-center">
                    <span className="loading loading-infinity loading-xl text-primary h-180 w-120"></span>
                </div>
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
