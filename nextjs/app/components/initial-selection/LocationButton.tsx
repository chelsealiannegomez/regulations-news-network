import { useState } from 'react'
import { Location } from '@/lib/definitions';

type LocationButtonProps = {
    location: Location,
    setLocationSet: React.Dispatch<React.SetStateAction<Set<number>>>;
}

export default function LocationButton ({location, setLocationSet} : LocationButtonProps) {
    const [isSelected, setIsSelected] = useState<boolean>(false);
    
    const handleSelect = () => {
        setIsSelected(!isSelected);
        if (!isSelected) {
            setLocationSet(prev => prev.add(location.id))
        } else {
            setLocationSet(prev => {
                const newSet = new Set(prev);
                newSet.delete(location.id);
                return newSet;
            })
        }
    }

    return (
        <div className={!isSelected ? "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2"
             : "bg-blue-500 text-white py-2 px-4 font-semibold border border-blue-500 border-transparent rounded m-2"} 
             onClick={handleSelect}
             >
                {location.location}
        </div>
    )
}