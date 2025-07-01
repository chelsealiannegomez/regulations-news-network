"use client";
import { useState } from "react";
import PreferenceButton from "./PreferenceButton";
import { User } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { preferences } from "@/lib/topics";

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
        console.log(preferenceSet);
        const preferenceArray = [...preferenceSet];
        console.log(JSON.stringify(preferenceArray));

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
            const message = await response.json();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <p>Next, select the topics you're interested in.</p>
            <form className="flex flex-wrap" onSubmit={handleSubmit}>
                {preferences.map((preference) => (
                    <PreferenceButton
                        preference={preference}
                        key={preference.id}
                        setPreferenceSet={setPreferenceSet}
                    />
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
