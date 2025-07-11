import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { topics } from "@/lib/topics";
import type { PreferencesList } from "@/lib/types";

export default function EditPreferencesList({
    preferences,
    setPreferences,
    setIsEdit,
    user,
}: PreferencesList) {
    const [input, setInput] = useState<string>("");
    const [userInput, setUserInput] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const keywords = topics.map((topic) => topic.topic);

    const [preferencesCopy, setPreferencesCopy] =
        useState<string[]>(preferences);

    const handleDeselect = (top: string) => {
        const preferredTemp = [...preferencesCopy].filter(
            (item) => item !== top
        );
        setPreferencesCopy(preferredTemp);
    };

    const handleSelect: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
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

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const typed = e.target.value;

        if (typed === "") {
            setInput("");
            setUserInput("");
            return;
        }

        if (typed.length < userInput.length || !typed.startsWith(userInput)) {
            setInput(typed);
            setUserInput(typed);
            return;
        }

        const suggestion = keywords.find((word) =>
            word.toLowerCase().startsWith(typed.toLowerCase())
        );

        if (!suggestion || typed === "") {
            setInput(typed);
            return;
        }

        setInput(suggestion);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.setSelectionRange(
                    typed.length,
                    suggestion.length
                );
            }
        }, 0);
    };

    const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab" && inputRef.current) {
            inputRef.current.setSelectionRange(input.length, input.length);
            e.preventDefault();
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
                    onChange={handleOnChange}
                    onKeyDown={handleOnKeyDown}
                    minLength={2}
                    value={input}
                    className="self-start bg-gray-100 py-2 px-5 my-1 rounded-xl"
                    ref={inputRef}
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
