import { useState } from 'react';
import PreferenceButton from "./PreferenceButton";

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
};

export default function PreferenceSelection ( {setStep}: PreferenceSelectionProps) {
    const [preferenceSet, setPreferenceSet] = useState<Set<number>>(new Set());

    const handleSubmit = () => {
        console.log(preferenceSet);
        // TODO: Update user in db with selected preferences
        setStep(prev => prev + 1);
    }

    return (
        <div>
            <p>Next, select the topics you're interested in.</p>
            <form className="flex" action={handleSubmit}>
                {preferences.map((preference) => (
                    <PreferenceButton preference={preference} key={preference.id} setPreferenceSet={setPreferenceSet}/>
                    )
                )}
                <button type="submit">Submit</button>
            </form>
        </div> 
    )
}