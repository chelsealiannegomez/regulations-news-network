"use client";
import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import { User, Article } from "@/lib/definitions";
import { parsePreferences } from "@/app/utils/parsePreferences";
import Pagination from "./Pagination";

type HomePageProps = {
    user: User;
};

const NUM_ARTICLES_PER_PAGE = 6;

export default function ArticleSection({ user }: HomePageProps) {
    const [query, setQuery] = useState<string>("");

    const [articles, setArticles] = useState<Article[]>([]);

    const [orderedArticles, setOrderedArticles] = useState<Article[]>([]);

    const [totalPages, setTotalPages] = useState<number>(1);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [currentPageArticles, setCurrentPageArticles] = useState<Article[]>(
        []
    );

    const [sortMode, setSortMode] = useState<string>("relevance");

    // const [articlesToDisplay, setArticlesToDisplay] = useState<Article[]>([]);

    useEffect(() => {
        fetch("api/articles")
            .then((res) => res.json())
            .then((data) => {
                setArticles(data.articles);
                setTotalPages(
                    Math.ceil(data.articles.length / NUM_ARTICLES_PER_PAGE)
                );
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
    }, [articles, user.preferences]);

    useEffect(() => {
        if (sortMode === "relevance") {
            if (currentPage < totalPages) {
                const currentPageContents = [...orderedArticles].slice(
                    currentPage * NUM_ARTICLES_PER_PAGE - NUM_ARTICLES_PER_PAGE,
                    currentPage * NUM_ARTICLES_PER_PAGE
                );

                console.log(currentPageContents);
                setCurrentPageArticles(currentPageContents);
            } else {
                const currentPageContents = [...orderedArticles].slice(
                    currentPage * NUM_ARTICLES_PER_PAGE - NUM_ARTICLES_PER_PAGE,
                    articles.length
                );
                setCurrentPageArticles(currentPageContents);
            }
        } else {
            if (currentPage < totalPages) {
                const currentPageContents = [...articles].slice(
                    currentPage * NUM_ARTICLES_PER_PAGE - NUM_ARTICLES_PER_PAGE,
                    currentPage * NUM_ARTICLES_PER_PAGE
                );

                console.log(currentPageContents);
                setCurrentPageArticles(currentPageContents);
            } else {
                const currentPageContents = [...articles].slice(
                    currentPage * NUM_ARTICLES_PER_PAGE - NUM_ARTICLES_PER_PAGE,
                    articles.length
                );
                setCurrentPageArticles(currentPageContents);
            }
        }
    }, [articles, currentPage, orderedArticles, totalPages, sortMode]);

    const handleSort = () => {
        setCurrentPage(1);
        if (sortMode === "relevance") {
            setSortMode("date posted");
        } else {
            setSortMode("relevance");
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
                    {sortMode === "relevance"
                        ? "Sort by Relevance"
                        : "Sort by Date Posted"}
                </div>
            </div>
            <p className="mb-3">Showing results for: {query}</p>
            {currentPageArticles[0] === undefined ? (
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
                            totalArticles={articles.length}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
