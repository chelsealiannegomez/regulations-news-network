import { Preference } from "@/lib/definitions";
import { useState } from "react";

type PreferenceProps = {
    preference: Preference;
    setPreferenceSet: React.Dispatch<React.SetStateAction<Set<number>>>;
};

export default function PreferenceButton({
    preference,
    setPreferenceSet,
}: PreferenceProps) {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const handleSelect = () => {
        setIsSelected(!isSelected);
        if (!isSelected) {
            setPreferenceSet((prev) => prev.add(preference.id));
        } else {
            setPreferenceSet((prev) => {
                const newSet = new Set(prev);
                newSet.delete(preference.id);
                return newSet;
            });
        }
    };

    return (
        <div
            className={
                !isSelected
                    ? "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2"
                    : "bg-blue-500 text-white py-2 px-4 font-semibold border border-blue-500 border-transparent rounded m-2"
            }
            onClick={handleSelect}
        >
            {preference.topic}
        </div>
    );
}
