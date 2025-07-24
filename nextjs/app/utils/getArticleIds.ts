export const getArticleIds = (
    pageNum: number,
    numArticlesPerPage: number,
    totalArticles: number
): number[] => {
    const firstId = (pageNum - 1) * numArticlesPerPage + 1;
    let lastId = pageNum * numArticlesPerPage;

    if (lastId > totalArticles) {
        lastId = totalArticles;
    }
    console.log("hi", firstId, lastId);
    return [firstId, lastId];
};

export default getArticleIds;
