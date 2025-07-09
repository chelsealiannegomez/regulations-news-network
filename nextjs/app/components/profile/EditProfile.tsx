import { useState } from "react";
import Image from "next/image";
import type { ProfilePageProps } from "@/lib/types";

export default function EditProfile({ user }: ProfilePageProps) {
    const [isNameEdit, setIsNameEdit] = useState<boolean>(false);
    const [newFirstName, setNewFirstName] = useState<string>(user.firstName);
    const [newLastName, setNewLastName] = useState<string>(user.lastName);

    const [isEmailEdit, setIsEmailEdit] = useState<boolean>(false);
    const [newEmail, setNewEmail] = useState<string>(user.email);

    const handleNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/edit/name/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName: newFirstName,
                    lastName: newLastName,
                }),
            });

            const message = await response.json();
            if (response.ok) {
                setIsNameEdit((prev) => !prev);
            }
            console.log(message.message);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNameCancel = () => {
        setIsNameEdit(!isNameEdit);
        setNewFirstName(user.firstName);
        setNewLastName(user.lastName);
    };

    const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/edit/email/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: newEmail,
                }),
            });

            const message = await response.json();
            if (response.ok) {
                setIsEmailEdit((prev) => !prev);
            }
            console.log(message.message);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEmailCancel = () => {
        setIsEmailEdit(!isEmailEdit);
        setNewEmail(user.email);
    };

    return (
        <div className="w-4/5 bg-white px-10">
            <h1 className="pt-10 text-2xl font-semibold mb-8">My Profile</h1>
            <div>
                <div className="relative border border-gray-300 rounded-3xl p-7 mb-8">
                    <h1 className="font-semibold mb-7 text-lg">
                        Personal Information
                    </h1>
                    <form className="flex" onSubmit={handleNameSubmit}>
                        <div className="w-1/2">
                            <p className="text-gray-500 text-sm">First Name</p>
                            {isNameEdit ? (
                                <input
                                    value={newFirstName}
                                    type="text"
                                    className="border border-blue-800 rounded-md"
                                    onChange={(e) =>
                                        setNewFirstName(e.target.value)
                                    }
                                />
                            ) : (
                                <p>{newFirstName}</p>
                            )}
                        </div>
                        <div className="w-1/2">
                            <p className="text-gray-500 text-sm">Last Name</p>
                            {isNameEdit ? (
                                <input
                                    value={newLastName}
                                    type="text"
                                    className="border border-blue-800 rounded-md"
                                    onChange={(e) =>
                                        setNewLastName(e.target.value)
                                    }
                                />
                            ) : (
                                <p>{newLastName}</p>
                            )}
                        </div>
                        {isNameEdit ? (
                            <div className="flex absolute right-5 top-5">
                                <button
                                    type="submit"
                                    className="mr-2 border border-gray-200 rounded-xl px-3 py-1 hover:bg-gray-200 cursor-pointer"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleNameCancel}
                                    className="border border-gray-200 rounded-xl px-3 py-1 hover:bg-gray-200 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div
                                className="absolute right-5 top-5 flex cursor-pointer bg-gray-200 rounded-xl py-2 px-3 opacity-85 hover:opacity-100 hover:bg-gray-300"
                                onClick={() => setIsNameEdit((prev) => !prev)}
                            >
                                Edit{" "}
                                <Image
                                    src="/edit.png"
                                    alt="edit icon"
                                    width={25}
                                    height={5}
                                />
                            </div>
                        )}
                    </form>
                </div>
                <div>
                    <div className="relative border border-gray-300 rounded-3xl p-7">
                        <h1 className="font-semibold mb-7 text-lg">
                            Email Address
                        </h1>
                        <form onSubmit={handleEmailSubmit}>
                            <p className="text-gray-500 text-sm">
                                Email Address
                            </p>
                            {isEmailEdit ? (
                                <input
                                    value={newEmail}
                                    type="text"
                                    className="border border-blue-800 rounded-md min-w-70"
                                    onChange={(e) =>
                                        setNewEmail(e.target.value)
                                    }
                                />
                            ) : (
                                <p>{newEmail}</p>
                            )}

                            {isEmailEdit ? (
                                <div className="flex absolute right-5 top-5">
                                    <button
                                        type="submit"
                                        className="mr-2 border border-gray-200 rounded-xl px-3 py-1 hover:bg-gray-200 cursor-pointer"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleEmailCancel}
                                        className="border border-gray-200 rounded-xl px-3 py-1 hover:bg-gray-200 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="absolute right-5 top-5 flex cursor-pointer bg-gray-200 rounded-xl py-2 px-3 opacity-85 hover:opacity-100 hover:bg-gray-300"
                                    onClick={() =>
                                        setIsEmailEdit((prev) => !prev)
                                    }
                                >
                                    Edit{" "}
                                    <Image
                                        src="/edit.png"
                                        alt="edit icon"
                                        width={25}
                                        height={5}
                                    />
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
