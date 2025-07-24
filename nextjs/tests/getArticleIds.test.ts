import { getArticleIds } from "@/app/utils/getArticleIds";

describe("getArticleIds function test", () => {
    it("returns firstId = lastId = 1 if only 1 article found", () => {
        const result = getArticleIds(1, 6, 1);
        expect(result).toEqual([1, 1]);
    });
    it("returns correct lastId if (lastId > totalArticles) ", () => {
        const result = getArticleIds(2, 6, 7);
        expect(result).toEqual([7, 7]);
    });
    it("returns correct lastId if (lastId = totalArticles) ", () => {
        const result = getArticleIds(2, 6, 12);
        expect(result).toEqual([7, 12]);
    });
});
