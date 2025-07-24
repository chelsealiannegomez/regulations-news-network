import prisma from "@/lib/prisma";
import { stopWords } from "@/lib/stopwords";
import type { Log } from "@/lib/types";

export const cosineSimilarity = (a: number[], b: number[]): number => {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(a.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (normA * normB);
};

export const recencyWeight = (daysOld: number, decayRate = 0.1): number => {
    return Math.exp(-decayRate * daysOld);
};

export const getQueryEmbedding = (
    query: string,
    word2int: Record<string, number>,
    embeddingMatrix: number[][]
): number[] | null => {
    const cleanedWords = query
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word && !stopWords.has(word));

    const indices = cleanedWords
        .map((word) => word2int[word])
        .filter((index) => index && index > 0);

    if (indices.length === 0) return null;

    const embeddingSize = embeddingMatrix[0].length;
    const meanVector = Array(embeddingSize).fill(0);

    indices.forEach((i) => {
        embeddingMatrix[i].forEach((v, j) => {
            meanVector[j] += v;
        });
    });

    return meanVector.map((v) => v / indices.length);
};

export const getAllUserLogs = async (user_id: number) => {
    try {
        const numDays = 10;
        const daysSinceSeen = new Date();
        daysSinceSeen.setDate(daysSinceSeen.getDate() - numDays);
        const logs: Log[] = await prisma.log.findMany({
            where: {
                user_id: user_id,
                time: {
                    gte: daysSinceSeen,
                },
            },
        });
        return logs;
    } catch (err) {
        return [];
    }
};

export const getArticleSeenWeight = (logs: number) => {
    if (logs > 3) {
        return 0;
    } else {
        return 1;
    }
};
