import { parseArticleContent } from "./parseArticle";

describe("parseArticleContent function test", () => {
    it("returns empty array if input is empty", () => {
        const result = parseArticleContent("");
        expect(result).toEqual([]);
    });
    it("splits input into an array of paragraphs", () => {
        const input =
            '{"This is paragraph 1.","This is paragraph 2.","This is paragraph 3."}';
        const result = parseArticleContent(input);
        expect(result).toEqual([
            "This is paragraph 1.",
            "This is paragraph 2.",
            "This is paragraph 3.",
        ]);
    });
    it('parses apostrophes \\" into just "', () => {
        const input =
            '{"This is \\"paragraph 1\\".","This is \\"paragraph 2\\".","This is \\"paragraph 3\\"."}';
        console.log(input);
        console.log(parseArticleContent(input));
        const result = parseArticleContent(input);
        expect(result).toEqual([
            'This is "paragraph 1".',
            'This is "paragraph 2".',
            'This is "paragraph 3".',
        ]);
    });
});
