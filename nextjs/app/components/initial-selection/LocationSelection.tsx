import { useState } from "react";
import LocationButton from "./LocationButton";
import { locations } from "@/lib/locations";
import type { LocationSelectionProps } from "@/lib/types";

export default function LocationSelection({
    setStep,
    user,
}: LocationSelectionProps) {
    const [locationSet, setLocationSet] = useState<Set<number>>(new Set());

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const locationArray = [...locationSet];

        try {
            const response = await fetch(
                `/api/auth/register/locations/${user.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ locations: locationArray }),
                }
            );

            if (response.ok) {
                setStep((prev) => prev + 1);
            }
            const message = await response.json();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <p>
                To get started, please select the locations you&apos;d like to
                see news from:
            </p>
            <form className="flex" onSubmit={handleSubmit}>
                {locations.map((location) => (
                    <LocationButton
                        key={location.id}
                        location={location}
                        setLocationSet={setLocationSet}
                    />
                ))}
                <button type="submit">Next</button>
            </form>
        </div>
    );
}
