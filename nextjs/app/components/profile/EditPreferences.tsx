import Image from "next/image";
import { useState } from "react";
import PreferenceButton from "../initial-selection/PreferenceButton";
import { preferences } from "@/lib/topics";
import { User } from "@/lib/definitions";
import PreferencesList from "./PreferencesList";

type ProfilePageProps = {
    user: User;
};

export default function EditPreferences({ user }: ProfilePageProps) {
    const [preferenceSet, setPreferenceSet] = useState<Set<number>>(new Set());

    return (
        <div className="w-4/5 bg-white px-10">
            <h1 className="pt-10 text-2xl font-semibold mb-8">
                My Preferences
            </h1>
            <div>
                <div className="relative border border-gray-300 rounded-3xl p-7 mb-8">
                    <h1 className="font-semibold mb-7 text-lg">Preferences</h1>
                    <div className="flex">
                        {user?.preferences ? (
                            <PreferencesList preferredIds={user.preferences} />
                        ) : (
                            <p>An error occured</p>
                        )}
                    </div>
                    <div className="absolute right-5 top-5 flex">
                        Edit{" "}
                        <Image
                            src="/edit.png"
                            alt="edit icon"
                            width={25}
                            height={5}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
