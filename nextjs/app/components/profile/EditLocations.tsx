import Image from "next/image";
import { locations } from "@/lib/locations";
import LocationButton from "../initial-selection/LocationButton";
import { useState } from "react";

export default function EditLocations() {
    const [locationSet, setLocationSet] = useState<Set<number>>(new Set());

    return (
        <div className="w-4/5 bg-white px-10">
            <h1 className="pt-10 text-2xl font-semibold mb-8">My Locations</h1>
            <div>
                <div className="relative border border-gray-300 rounded-3xl p-7 mb-8">
                    <h1 className="font-semibold mb-7 text-lg">Locations</h1>
                    <div className="flex">
                        <form className="flex flex-wrap">
                            {locations.map((location) => (
                                <LocationButton
                                    key={location.id}
                                    location={location}
                                    setLocationSet={setLocationSet}
                                />
                            ))}
                        </form>
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
