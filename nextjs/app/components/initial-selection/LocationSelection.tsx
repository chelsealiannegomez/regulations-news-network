import { useState } from "react";
import LocationButton from "./LocationButton";
import { locations } from "@/lib/locations";
import { User } from "@/lib/definitions";

type LocationSelectionProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    user: User;
};

export default function LocationSelection({
    setStep,
    user,
}: LocationSelectionProps) {
    const [locationSet, setLocationSet] = useState<Set<number>>(new Set());

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(locationSet);
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
            console.log(message.message);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <p>
                To get started, please select the locations you'd like to see
                news from:
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
