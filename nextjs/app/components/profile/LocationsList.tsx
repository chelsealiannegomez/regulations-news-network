import { locations } from "@/lib/locations";
import type { LocationsListProps } from "@/lib/types";

export default function LocationsList({ preferredIds }: LocationsListProps) {
    const preferredLocations = locations.filter((loc) =>
        preferredIds.includes(loc.id)
    );

    const otherLocations = locations.filter(
        (loc) => !preferredIds.includes(loc.id)
    );

    return (
        <div>
            <p className="font-semibold mb-2">Selected:</p>
            {preferredLocations.map((loc) => (
                <div key={loc.id}>{loc.location}</div>
            ))}
            <br></br>
            <p className="font-semibold mb-2">Not Selected:</p>
            {otherLocations.map((loc) => (
                <div key={loc.id}>{loc.location}</div>
            ))}
        </div>
    );
}
