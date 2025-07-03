"use client";
import { User } from "@/lib/definitions";
import { useState, useEffect } from "react";

type HomePageProps = {
    user: User;
};

export default function Hero({ user }: HomePageProps) {
    const [fadeIn, setFadeIn] = useState<boolean>(false);

    useEffect(() => {
        setFadeIn(true);
    }, []);

    const handleScroll = () => {
        const viewportHeight = window.innerHeight;
        const currentScroll = window.scrollY;

        const nextScrollPosition =
            Math.ceil((currentScroll + 1) / viewportHeight) * viewportHeight;

        window.scrollTo({
            top: nextScrollPosition,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative mx-auto bg-[url(/hero.jpg)] bg-fixed bg-cover">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 z-0"></div>
            <div className="relative h-[calc(100vh-4rem)] flex justify-center items-center flex-col text-center z-1">
                <p
                    className={`mb-5 text-6xl duration-2000 transition-opacity${
                        fadeIn ? "opacity-100" : "opacity-0"
                    }`}
                >
                    Welcome, <b>{user.firstName}</b>.
                </p>
                <p className="max-w-2xl text-gray-600 mt-2">
                    Your go-to source for clear, timely updates on{" "}
                    <span className="text-black font-semibold">
                        privacy regulations
                    </span>{" "}
                    worldwide. Whether you’re a professional, policymaker, or
                    simply curious,{" "}
                    <span className="text-black font-bold">RNN</span> makes it
                    easy to stay informed about the latest laws and news shaping
                    data privacy —{" "}
                    <span className="text-black font-semibold">
                        all in one convenient place.
                    </span>
                </p>
                <div
                    className="bg-black text-white font-semibold py-3 px-5 rounded-xl mt-7 cursor-pointer hover:bg-gray-800"
                    onClick={handleScroll}
                >
                    See your personalized news feed
                </div>
            </div>
        </div>
    );
}
