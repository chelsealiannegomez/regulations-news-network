import { useState } from 'react';
import LocationButton from './LocationButton';
import { locations } from '@/lib/locations'

type LocationSelectionProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
};

export default function LocationSelection ( {setStep}: LocationSelectionProps ) {
    const [locationSet, setLocationSet] = useState<Set<number>>(new Set());

    const handleSubmit = () => {
        console.log(locationSet);
        // TO DO: Update user in db with selected locations
        setStep(prev => prev + 1);
    }

    return (
        <div>
            <p>To get started, please select the locations you'd like to see news from:</p>
            <form className="flex" action={handleSubmit}>
                {locations.map((location) => (
                    <LocationButton key={location.id} location={location} setLocationSet={setLocationSet}/>
                    )
                )}
                <button type="submit">Next</button>
            </form>
        </div> 
    )
}