import { topics } from "@/lib/topics";

export function parsePreferences(input: number[]): {
    query: string;
    display: string;
} {
    if (input.length === 0) {
        return { query: "", display: "" };
    }

    const preferences: string[] = [];

    topics.map((topic) => {
        if (input.includes(topic.id)) {
            preferences.push(topic.topic);
        }
    });

    return {
        query: preferences.join(" and "),
        display: preferences.join(", "),
    };
}
