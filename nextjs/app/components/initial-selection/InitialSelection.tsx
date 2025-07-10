"use client";
import { useState } from "react";
import PreferenceSelection from "./PreferenceSelection";
import LocationSelection from "./LocationSelection";
import type { InitialSelectionProps } from "@/lib/types";

export default function InitialSelection({ user }: InitialSelectionProps) {
    const [step, setStep] = useState<number>(1);

    return (
        <div>
            <header className="h-20 flex justify-center items-center text-xl">
                Regulations News Network
            </header>
            <div className="mx-5">
                <p className="mb-5">
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
