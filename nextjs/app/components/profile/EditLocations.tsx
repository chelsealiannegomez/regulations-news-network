import { useState } from "react";
import Image from "next/image";
import LocationsList from "./LocationsList";
import { User } from "@/lib/definitions";
import EditLocationsList from "./EditLocationsList";

type ProfilePageProps = {
    user: User;
};

export default function EditLocations({ user }: ProfilePageProps) {
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const preferredLocationIds = user.locations ? user.locations : [];

    const [preferredIds, setPreferredIds] =
        useState<number[]>(preferredLocationIds);

    return (
        <div className="w-4/5 bg-white px-10">
            <h1 className="pt-10 text-2xl font-semibold mb-8">My Locations</h1>
            <div>
                <div className="relative border border-gray-300 rounded-3xl p-7 mb-8">
                    <h1 className="font-semibold mb-7 text-lg">Locations</h1>
                    {!isEdit ? (
                        <div>
                            <div className="flex">
                                {user?.locations ? (
                                    <LocationsList
                                        preferredIds={preferredIds}
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
                            {user?.locations ? (
                                <EditLocationsList
                                    preferredIds={preferredIds}
                                    setPreferredIds={setPreferredIds}
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
