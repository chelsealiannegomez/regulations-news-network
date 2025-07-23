/**
 * @jest-environment node
 */

import { POST } from "@/app/api/articles/relevance/route";
import { envClientSchema } from "@/lib/clientEnvSchema";

const NUM_ARTICLES_PER_PAGE = envClientSchema.NEXT_PUBLIC_NUM_ARTICLES_PER_PAGE;

describe("fetch paginated articles", () => {
    it("should return data of length NUM_ARTICLES_PER_PAGE if page contains the full number of articles", async () => {
        const pageNum = 1;
        const requestObj = {
            json: async () => ({
                query: "AI Governance",
                page_num: pageNum,
                num_articles_per_page: NUM_ARTICLES_PER_PAGE,
            }),
        } as any;
        const response = await POST(requestObj);
        const body = await response.json();

        if (body.articles.totalArticles > pageNum * NUM_ARTICLES_PER_PAGE) {
        }

        expect(response.status).toBe(200);
        expect(body.articles.results.length).toBe(NUM_ARTICLES_PER_PAGE);
    });
    it("should return data of correct length if it is the last page", async () => {
        const pageNum = 1;
        const requestObj = {
            json: async () => ({
                query: "AI Governance",
                page_num: pageNum,
                num_articles_per_page: NUM_ARTICLES_PER_PAGE,
            }),
        } as any;
        const response = await POST(requestObj);
        const body = await response.json();

        if (body.articles.totalArticles < pageNum * NUM_ARTICLES_PER_PAGE) {
            expect(response.status).toBe(200);
            expect(body.articles.results.length).toBe(
                body.articles.totalArticles -
                    (pageNum - 1) * NUM_ARTICLES_PER_PAGE
            );
        } else {
            expect(response.status).toBe(200);
            expect(body.articles.results.length).toBe(NUM_ARTICLES_PER_PAGE);
        }
    });
});
