"use client";
import { useState } from "react";
import Hero from "./Hero";
import ArticleSection from "./ArticleSection";
import { User } from "@/lib/definitions";

type HomePageProps = {
    user: User;
};

export default function HomePage({ user }: HomePageProps) {
    const [page, setPage] = useState<string>("home");

    return (
        <div className="">
            <nav className="flex mx-auto bg-gray-900 h-16 text-white justify-between items-center">
                <div className="ml-5">Regulation News Network</div>
                <ul className="flex space-x-4 mr-5">
                    <li
                        className={
                            page === "home"
                                ? "bg-gray-900 text-white rounded-md px-3 py-2 text-base font-medium underline"
                                : "text-gray-300 hover:underline hover:text-white rounded-md px-3 py-2 text-base font-medium"
                        }
                        onClick={() => setPage("home")}
                    >
                        Home
                    </li>
                    <li
                        className={
                            page === "profile"
                                ? "bg-gray-900 text-white rounded-md px-3 py-2 text-base font-medium underline"
                                : "text-gray-300 hover:underline hover:text-white rounded-md px-3 py-2 text-base font-medium"
                        }
                        onClick={() => setPage("profile")}
                    >
                        Profile
                    </li>
                </ul>
            </nav>
            {page === "home" ? (
                <div>
                    <Hero user={user} />
                    <ArticleSection />{" "}
                </div>
            ) : null}
        </div>
    );
}
