"use client";
import { useState } from "react";
import PreferenceButton from "./PreferenceButton";
import { User } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { topics } from "@/lib/topics";

type PreferenceSelectionProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    user: User;
};

export default function PreferenceSelection({
    setStep,
    user,
}: PreferenceSelectionProps) {
    const [preferenceSet, setPreferenceSet] = useState<Set<number>>(new Set());

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const preferenceArray = [...preferenceSet];

        try {
            const response = await fetch(
                `/api/auth/register/preferences/${user.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ preferences: preferenceArray }),
                }
            );

            if (response.ok) {
                router.push("/home");
                setStep((prev) => prev + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <p>Next, select the topics you&apos;re interested in.</p>
            <form className="flex flex-wrap" onSubmit={handleSubmit}>
                {topics.map((topics) => (
                    <PreferenceButton
                        preference={topics}
                        key={topics.id}
                        setPreferenceSet={setPreferenceSet}
                    />
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
