"use client";
import type { HomePageProps } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SignUp({ user }: HomePageProps) {
    const [isInMailingList, setIsInMailingList] = useState<boolean>(false);
    const check = async () => {
        try {
            const response = await fetch(`/api/sign_up/${user.id}/check`);
            const data = await response.json();
            if (response.status === 409) {
                setIsInMailingList(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        check();
    }, []);

    const handleSignUp = async () => {
        try {
            const response = await fetch(`/api/sign_up/${user.id}`);
            const data = await response.json();
            if (response.ok) {
                alert("Signed up successfully!");
                check();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnsubscribe = async () => {
        try {
            const response = await fetch(`/api/sign_up/${user.id}/unsubscribe`);
            const data = await response.json();
            if (response.ok) {
                alert("Unsubscribed from mailing list");
            }
            check();
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="min-h-screen bg-white flex items-center justify-center text-black">
            {isInMailingList ? (
                <div className="text-center">
                    <p className="text-5xl mb-5">Already signed up!</p>
                    <p>Want to remove your email from the mailing list?</p>
                    <button
                        className="bg-gray-200 text-black py-3 px-6 rounded-xl mt-5"
                        onClick={handleUnsubscribe}
                    >
                        Unsubscribe
                    </button>
                </div>
            ) : (
                <div className="flex justify-center items-center flex-col w-7/10 text-black">
                    <p className="text-3xl font-semibold mb-5 text-center">
                        Join our mailing list and never miss an update on
                        privacy regulations that matter to you.
                    </p>
                    <p className="text-black text-center text-lg mb-5">
                        Get timely insights, actionable tips for proactive
                        compliance, and personalized news delivered straight to
                        your inbox. Stay informed, protect your organization,
                        and anticipate changes before they happen—subscribe now!
                    </p>

                    <p>Your email: {user.email}</p>
                    <p className="mb-5">
                        Not the right email? Change it in your{" "}
                        <Link href="/profile" className="underline">
                            profile
                        </Link>
                        .
                    </p>
                    <button
                        className="bg-gray-200 text-black py-3 px-6 rounded-xl"
                        onClick={handleSignUp}
                    >
                        Sign up now!
                    </button>
                </div>
            )}
        </div>
    );
}
