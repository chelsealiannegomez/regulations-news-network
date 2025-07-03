import Image from "next/image";
import { useState } from "react";
import LocationsList from "./LocationsList";
import { User } from "@/lib/definitions";

type ProfilePageProps = {
    user: User;
};

export default function EditLocations({ user }: ProfilePageProps) {
    const [locationSet, setLocationSet] = useState<Set<number>>(new Set());

    return (
        <div className="w-4/5 bg-white px-10">
            <h1 className="pt-10 text-2xl font-semibold mb-8">My Locations</h1>
            <div>
                <div className="relative border border-gray-300 rounded-3xl p-7 mb-8">
                    <h1 className="font-semibold mb-7 text-lg">Locations</h1>
                    <div className="flex">
                        {user?.locations ? (
                            <LocationsList preferredIds={user.locations} />
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
