import { useState } from "react";
import { topics } from "@/lib/topics";
import { User } from "@/lib/definitions";

type PreferencesList = {
    preferredIds: number[];
    setPreferredIds: React.Dispatch<React.SetStateAction<number[]>>;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
};

type topic = {
    id: number;
    topic: string;
};

export default function EditPreferencesList({
    preferredIds,
    setPreferredIds,
    setIsEdit,
    user,
}: PreferencesList) {
    const preferredTopics = topics.filter((top) =>
        preferredIds.includes(top.id)
    );

    const otherTopics = topics.filter((top) => !preferredIds.includes(top.id));

    const [preferredTopicsArray, setPreferredTopicsArray] =
        useState<topic[]>(preferredTopics);
    const [otherTopicsArray, setOtherTopicsArray] =
        useState<topic[]>(otherTopics);

    const handleDeselect = (top: topic) => {
        const preferredTemp = [...preferredTopicsArray].filter(
            (item) => item !== top
        );
        setPreferredTopicsArray(preferredTemp);

        const othersTemp = [...otherTopicsArray];
        othersTemp.push(top);
        setOtherTopicsArray(othersTemp);
    };

    const handleSelect = (top: topic) => {
        const othersTemp = [...otherTopicsArray].filter((item) => item !== top);
        setOtherTopicsArray(othersTemp);

        const preferredTemp = [...preferredTopicsArray];
        preferredTemp.push(top);
        setPreferredTopicsArray(preferredTemp);
    };

    const handleSave = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        const preferredTopicIds = preferredTopicsArray.map((top) => top.id);

        setPreferredIds(preferredTopicIds);

        try {
            const response = await fetch(`/api/edit/preferences/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    preferences: preferredTopicIds,
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
                {preferredTopicsArray.map((top) => (
                    <div
                        key={top.id}
                        className="self-start bg-gray-100 py-2 px-5 my-1 rounded-xl cursor-pointer hover:bg-gray-300"
                    >
                        {top.topic}{" "}
                        <span
                            className="text-gray-400 ml-2 text-2xl hover:text-gray-800 cursor-pointer"
                            onClick={() => handleDeselect(top)}
                        >
                            &times;
                        </span>
                    </div>
                ))}
            </div>
            <br></br>
            <p className="font-semibold mb-2">Not Selected:</p>
            <div className="flex flex-col">
                {otherTopicsArray.map((top) => (
                    <div
                        key={top.id}
                        className="self-start bg-gray-200 py-2 px-5 my-1 rounded-xl cursor-pointer hover:bg-gray-300"
                        onClick={() => handleSelect(top)}
                    >
                        {top.topic}{" "}
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
