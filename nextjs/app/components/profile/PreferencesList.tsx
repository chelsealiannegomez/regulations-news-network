import type { PreferencesListProps } from "@/lib/types";

export default function PreferencesList({ preferences }: PreferencesListProps) {
    return (
        <div>
            <p className="font-semibold mb-2">Selected:</p>
            {preferences?.map((pref) => (
                <div key={preferences.indexOf(pref)}>{pref}</div>
            ))}
            <br></br>
        </div>
    );
}
