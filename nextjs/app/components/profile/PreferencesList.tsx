import { topics } from "@/lib/topics";

type PreferencesListProps = {
    preferredIds: number[];
};

export default function PreferencesList({
    preferredIds,
}: PreferencesListProps) {
    const preferredLocations = topics.filter((pref) =>
        preferredIds.includes(pref.id)
    );

    const otherLocations = topics.filter(
        (pref) => !preferredIds.includes(pref.id)
    );

    return (
        <div>
            <p className="font-semibold mb-2">Selected:</p>
            {preferredLocations.map((pref) => (
                <div key={pref.id}>{pref.topic}</div>
            ))}
            <br></br>
            <p className="font-semibold mb-2">Not Selected:</p>
            {otherLocations.map((pref) => (
                <div key={pref.id}>{pref.topic}</div>
            ))}
        </div>
    );
}
