import { useState } from "react";
import { locations } from "@/lib/locations";
import { User } from "@/lib/definitions";

type LocationsListProps = {
    preferredIds: number[];
    setPreferredIds: React.Dispatch<React.SetStateAction<number[]>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
};

type location = {
    id: number;
    location: string;
};

export default function EditLocationsList({
    preferredIds,
    setPreferredIds,
    setIsEdit,
    user,
}: LocationsListProps) {
    const preferredLocations = locations.filter((loc) =>
        preferredIds.includes(loc.id)
    );

    const otherLocations = locations.filter(
        (loc) => !preferredIds.includes(loc.id)
    );

    const [preferredLocationsArray, setPreferredLocationsArray] =
        useState<location[]>(preferredLocations);
    const [otherLocationsArray, setOtherLocationsArray] =
        useState<location[]>(otherLocations);

    const handleDeselect = (loc: location) => {
        const preferredTemp = [...preferredLocationsArray].filter(
            (item) => item !== loc
        );
        setPreferredLocationsArray(preferredTemp);

        const othersTemp = [...otherLocationsArray];
        othersTemp.push(loc);
        setOtherLocationsArray(othersTemp);
    };

    const handleSelect = (loc: location) => {
        const othersTemp = [...otherLocationsArray].filter(
            (item) => item !== loc
        );
        setOtherLocationsArray(othersTemp);

        const preferredTemp = [...preferredLocationsArray];
        preferredTemp.push(loc);
        setPreferredLocationsArray(preferredTemp);
    };

    const handleSave = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        const preferredLocationIds = preferredLocationsArray.map(
            (loc) => loc.id
        );

        setPreferredIds(preferredLocationIds);

        try {
            const response = await fetch(`/api/edit/locations/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    locations: preferredLocationIds,
                }),
            });

            const message = await response.json();
            if (response.ok) {
                setIsEdit((prev) => !prev);
            }
            console.log(message.message);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <p className="font-semibold mb-2">Selected:</p>
            <div className="flex flex-col">
                {preferredLocationsArray.map((loc) => (
                    <div
                        key={loc.id}
                        className="self-start bg-gray-100 py-2 px-5 my-1 rounded-xl cursor-pointer hover:bg-gray-300"
                    >
                        {loc.location}{" "}
                        <span
                            className="text-gray-400 ml-2 text-2xl hover:text-gray-800 cursor-pointer"
                            onClick={() => handleDeselect(loc)}
                        >
                            &times;
                        </span>
                    </div>
                ))}
            </div>
            <br></br>
            <p className="font-semibold mb-2">Not Selected:</p>
            <div className="flex flex-col">
                {otherLocationsArray.map((loc) => (
                    <div
                        key={loc.id}
                        className="self-start bg-gray-200 py-2 px-5 my-1 rounded-xl cursor-pointer hover:bg-gray-300"
                        onClick={() => handleSelect(loc)}
                    >
                        {loc.location}{" "}
                    </div>
                ))}
            </div>
            <div
                className="absolute right-5 top-5 flex cursor-pointer border border-gray-200 rounded-xl px-3 py-1 hover:bg-gray-200 cursor-pointer"
                onClick={handleSave}
            >
                Save
            </div>
        </div>
    );
}
