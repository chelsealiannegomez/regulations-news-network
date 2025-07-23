import { locations } from "@/lib/locations";

export default function parseLocations(userLocations: number[]) {
    let locationsString = "";
    for (let i = 0; i < userLocations.length; i++) {
        locationsString =
            locationsString +
            locations.find((loc) => loc.id === userLocations[i])?.location +
            ", ";
    }
    return locationsString;
}
