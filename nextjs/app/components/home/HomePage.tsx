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
            <div>
                <Hero user={user} />
                <ArticleSection />{" "}
            </div>
        </div>
    );
}
