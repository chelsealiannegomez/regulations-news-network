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

    useEffect(() => {
        fetch("api/articles")
            .then((res) => res.json())
            .then((data) => {
                setArticles(data.articles);
                setOrderedArticles(data.articles);
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
                orderedArticles.length
            );
            setCurrentPageArticles(currentPageContents);
        }
    }, [articles, currentPage]);

    return (
        <div className="px-5 bg-gray-100 pb-10">
            <div className="text-2xl font-semibold py-5">News for You</div>
            <p className="mb-3">Showing results for: {query}</p>
            {currentPageArticles[0] === undefined ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {currentPageArticles.map((article) => (
                        <ArticleCard article={article} key={article.id} />
                    ))}
                </div>
            )}
            <div className="flex">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}
