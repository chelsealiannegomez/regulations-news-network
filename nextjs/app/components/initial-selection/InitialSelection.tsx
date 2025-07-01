"use client";
import { User, Article } from "@/lib/definitions";
import { useState, useEffect } from "react";
import PreferenceSelection from "./PreferenceSelection";
import LocationSelection from "./LocationSelection";

type InitialSelectionProps = {
    user: User;
};

export default function InitialSelection({ user }: InitialSelectionProps) {

    const [step, setStep] = useState<number>(1);


    return (
        <div>
            <header className="h-20 flex justify-center items-center text-xl">
                Regulations News Network
            </header>
            <div className="mx-5">
                <p className="mb-5">Welcome to Regulations News Network, {user.firstName}!</p>
                {(step === 1) ? <LocationSelection setStep={setStep} user={user}/> : null}
                {(step === 2) ? <PreferenceSelection setStep={setStep} user={user}/> : null}

            </div>
        </div>
    );
}
