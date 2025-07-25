import { cosineSimilarity } from "./queryHelpers";
import { Embedding } from "@/lib/types";
import fs from "fs";
import path from "path";

export function cosineDistance(a: number[], b: number[]) {
    // Need to compute the DIFFERENCE between articles so that we can minimize the distances in each cluster
    return 1 - cosineSimilarity(a, b);
}

export function initializeCentroids(data: number[][], k: number) {
    // Shuffle articles and get the first k articles to serve as the centroids
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, k);
}

export function assignCluster(data: Embedding[], centroids: number[][]) {
    const newData = [];
    for (const article of data) {
        let closestClusterIndex = 0;
        let smallestDistance = Infinity;

        centroids.forEach((centroid, idx) => {
            const dist = cosineDistance(article.vector, centroid); // calculate cosine distance between article vector and each centroid

            if (dist < smallestDistance) {
                smallestDistance = dist;
                closestClusterIndex = idx;
            }
        });
        newData.push({
            ...article,
            cluster: closestClusterIndex,
        });
    }
    return newData;
}

export function averageCentroid( // Calculate the average centroid given all the vectors in a cluster
    centroid: number[],
    clusteredArticles: Embedding[]
) {
    if (clusteredArticles.length === 0) {
        return centroid;
    }

    const vectorLength = clusteredArticles[0].vector.length;
    const sum = new Array(vectorLength).fill(0);

    for (const vector of clusteredArticles) {
        for (let i = 0; i < vectorLength; i++) {
            sum[i] += vector.vector[i];
        }
    }
    return sum.map((val) => val / clusteredArticles.length);
}

export function updateCentroids(centroids: number[][], data: Embedding[]) {
    // Update centroids with the average of vectors
    const newCentroids: number[][] = [];
    centroids.forEach((centroid, idx) => {
        const clusteredArticles = data.filter((item) => item.cluster === idx);
        newCentroids.push(averageCentroid(centroid, clusteredArticles));
    });
    return newCentroids;
}

export function equalLists(list1: Embedding[], list2: Embedding[]) {
    for (let i = 0; i < list1.length; i++) {
        if (list1[i].cluster !== list2[i].cluster) {
            return false;
        }
    }
    return true;
}

export function kMeans(data: Embedding[], k: number, maxIterations = 20) {
    let centroids = initializeCentroids(
        data.map((d) => d.vector),
        k
    );

    let iterations = 0;
    let previousData = assignCluster(data, centroids);

    while (iterations < maxIterations) {
        centroids = updateCentroids(centroids, previousData);
        const assignedClusters = assignCluster(previousData, centroids);
        if (equalLists(previousData, assignedClusters)) {
            break;
        }
        previousData = assignedClusters;
        iterations++;
    }

    const publicPath = path.resolve(__dirname, "centroids.json");

    fs.writeFileSync(publicPath, JSON.stringify(centroids, null, 2));
    return previousData;
}
