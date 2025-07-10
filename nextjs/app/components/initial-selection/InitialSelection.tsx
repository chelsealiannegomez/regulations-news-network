"use client";
import { useState } from "react";
import PreferenceSelection from "./PreferenceSelection";
import LocationSelection from "./LocationSelection";
import type { InitialSelectionProps } from "@/lib/types";

export default function InitialSelection({ user }: InitialSelectionProps) {
    const [step, setStep] = useState<number>(1);

    return (
        <div className="bg-white text-black h-screen">
            <nav className="flex mx-auto bg-gray-900 h-16 text-white justify-between items-center">
                <div className="ml-5">Regulation News Network</div>
            </nav>
            <div className="mx-5 my-5">
                <p className="mb-5 text-xl">
                    Welcome to Regulations News Network, {user.firstName}!
                </p>
                {step === 1 ? (
                    <LocationSelection setStep={setStep} user={user} />
                ) : null}
                {step === 2 ? (
                    <PreferenceSelection setStep={setStep} user={user} />
                ) : null}
            </div>
        </div>
    );
}
