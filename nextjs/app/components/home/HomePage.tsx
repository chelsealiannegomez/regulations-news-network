"use client";
import Hero from "./Hero";
import ArticleSection from "./ArticleSection";
import type { HomePageProps } from "@/lib/types";

export default function HomePage({ user }: HomePageProps) {
    return (
        <div>
            <div className="text-black">
                <Hero user={user} />
                <ArticleSection user={user} />
            </div>
        </div>
    );
}
