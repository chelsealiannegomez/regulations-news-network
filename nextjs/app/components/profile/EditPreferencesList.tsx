import { useState, MouseEventHandler } from "react";
import type { PreferencesList } from "@/lib/types";

export default function EditPreferencesList({
    preferences,
    setPreferences,
    setIsEdit,
    user,
}: PreferencesList) {
    const [input, setInput] = useState<string>("");

    const [preferencesCopy, setPreferencesCopy] =
        useState<string[]>(preferences);

    const handleDeselect = (top: string) => {
        const preferredTemp = [...preferencesCopy].filter(
            (item) => item !== top
        );
        setPreferencesCopy(preferredTemp);
    };

    const handleSelect: React.MouseEventHandler<HTMLDivElement> = (event) => {
        if (input.length === 0) {
            alert("Cannot be empty");
        } else {
            const preferredTemp = [...preferencesCopy];
            preferredTemp.push(input);
            setPreferencesCopy(preferredTemp);
            setInput("");
            console.log(preferredTemp);
        }
    };

    const handleSave = async (e: React.MouseEvent<HTMLDivElement>) => {
        setPreferences(preferencesCopy);
        e.preventDefault();
        try {
            const response = await fetch(`/api/edit/preferences/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    preferences: preferencesCopy,
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
            <p className="font-semibold mb-2">Current Keywords:</p>
            <div className="flex flex-col">
                {preferencesCopy.map((top) => (
                    <div
                        key={preferencesCopy.indexOf(top)}
                        className="self-start bg-gray-100 py-2 px-5 my-1 rounded-xl cursor-pointer hover:bg-gray-300"
                    >
                        {top}{" "}
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
            <p className="font-semibold mb-2">Add Keyword:</p>
            <form className="flex">
                <input
                    type="text"
                    onChange={(e) => setInput(e.target.value)}
                    minLength={2}
                    value={input}
                    className="self-start bg-gray-100 py-2 px-5 my-1 rounded-xl"
                ></input>
                <div onClick={handleSelect} className="ml-2 my-auto">
                    Submit
                </div>
            </form>
            <div
                className="absolute right-5 top-5 flex cursor-pointer border border-gray-200 rounded-xl px-3 py-1 hover:bg-gray-200 cursor-pointer"
                onClick={handleSave}
            >
                Save
            </div>
        </div>
    );
}
