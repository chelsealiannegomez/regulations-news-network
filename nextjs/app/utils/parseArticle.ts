export function parseArticleContent(input: string): string[] {
    if (input === "") {
        return [];
    }
    let trimmed = input.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        trimmed = trimmed.slice(2, -2);
    }

    const newTrimmed = trimmed.replaceAll('\\"', '"');

    return newTrimmed.split('","');
}
