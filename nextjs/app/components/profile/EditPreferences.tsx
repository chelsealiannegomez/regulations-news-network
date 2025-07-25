import { useState } from "react";
import Image from "next/image";
import PreferencesList from "./PreferencesList";
import EditPreferencesList from "./EditPreferencesList";
import type { ProfilePageProps } from "@/lib/types";

export default function EditPreferences({ user }: ProfilePageProps) {
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [preferences, setPreferences] = useState<string[]>(
        user.preferences ? user.preferences : []
    );

    return (
        <div className="w-4/5 bg-white px-10">
            <h1 className="pt-10 text-2xl font-semibold mb-8">
                My Preferences
            </h1>
            <div>
                <div className="relative border border-gray-300 rounded-3xl p-7 mb-8">
                    <h1 className="font-semibold mb-7 text-lg">Preferences</h1>
                    {!isEdit ? (
                        <div>
                            <div className="flex">
                                {preferences ? (
                                    <PreferencesList
                                        preferences={preferences}
                                    />
                                ) : (
                                    <p>An error occured</p>
                                )}
                            </div>
                            <div
                                className="absolute right-5 top-5 flex cursor-pointer bg-gray-200 rounded-xl py-2 px-3 opacity-85 hover:opacity-100 hover:bg-gray-300"
                                onClick={() => setIsEdit(!isEdit)}
                            >
                                Edit{" "}
                                <Image
                                    src="/edit.png"
                                    alt="edit icon"
                                    width={25}
                                    height={5}
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            {user?.preferences ? (
                                <EditPreferencesList
                                    preferences={preferences}
                                    setPreferences={setPreferences}
                                    setIsEdit={setIsEdit}
                                    user={user}
                                />
                            ) : (
                                <p>An error occured</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
