import type { NextAPIRequest, NextAPIResponse } from "next";
import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

dotenv.config();

const stopWords = new Set([
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
]);

let wordEmbeddings: number[][] = [];
let word2int: Record<string, number> = {};

const loadEmbeddings = () => {
    if (wordEmbeddings.length === 0) {
        const csvData = fs.readFileSync(
            path.join(process.cwd(), "public", "word_embeddings.csv"),
            "utf-8"
        );
        const rawRecords = parse(csvData, {
            columns: false,
            cast: (value: string) => parseFloat(value)
        }) as (number | string)[][];

        const records: number[][] = rawRecords.map(row => row.map(cell => Number(cell)));

        wordEmbeddings = records;
    }
    if (Object.keys(word2int).length === 0) {
        const jsonData = fs.readFileSync(
            path.join(process.cwd(), "public", "word2int.json"),
            "utf-8"
        );
        word2int = JSON.parse(jsonData);
    }
}

const cosineSimilarity = (a: number[], b: number[]): number => {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(a.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (normA * normB);
}

const recencyWeight = (daysOld: number, decayRate = 0.1) : number => {
    return Math.exp(-decayRate * daysOld)
}

const getQueryEmbedding = (query: string, word2int: Record<string, number>, embeddingMatrix: number[][]) : number[] | null {
    const cleanedWords = query
        .toLowerCase()
        .replace(/[".,:;?'()]/g, "")
        .split(/\s+/)
        .filter( word => word && !stopWords.has(word));

    const indices = cleanedWords
        .map(word => word2int[word])
        .filter(index => index && index > 0);

    if (indices.length === 0) return null;
    
}

