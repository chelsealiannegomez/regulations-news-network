import { useState } from 'react';
import PreferenceButton from "./PreferenceButton";
import { User } from '@/lib/definitions';

const preferences = [
    {
        id: 1,
        topic: "AI Governance",
    },
    {
        id: 2,
        topic: "Audit & Assurance",
    },
    {
        id: 3,
        topic: "Biometrics",
    },
    {
        id: 4,
        topic: "Budge & Salaries",
    },
    {
        id: 5,
        topic: "Children's Privacy",
    }
]

type PreferenceSelectionProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
    user: User;
};

export default function PreferenceSelection ( {setStep, user}: PreferenceSelectionProps) {
    const [preferenceSet, setPreferenceSet] = useState<Set<number>>(new Set());

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(preferenceSet)
        const preferenceArray = [...preferenceSet];
        console.log(JSON.stringify(preferenceArray))

        try {
            const response = await fetch(`/api/auth/register/preferences/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({preferences: preferenceArray})
            })

            if (response.ok) {
                setStep(prev => prev + 1);
            }
            const message = await response.json();
            console.log(message.message)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <p>Next, select the topics you're interested in.</p>
            <form className="flex" onSubmit={handleSubmit}>
                {preferences.map((preference) => (
                    <PreferenceButton preference={preference} key={preference.id} setPreferenceSet={setPreferenceSet}/>
                    )
                )}
                <button type="submit">Submit</button>
            </form>
        </div> 
    )
}