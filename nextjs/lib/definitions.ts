export interface SessionPayLoad {
    userId: number;
    email?: string;
    preferences?: number[];
    expiresAt: number;
    [key: string]: unknown;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    preferences?: number[];
}

export interface Article {
    id: number;
    url: string;
    title: string;
    date_posted: string;
    location: string;
    description: string;
    content: string;
    keywords: Keyword[];
}

export interface Keyword {
    score: number;
    keyword: string;
}

export interface Preference {
    id: number;
    topic: string;
}

export interface Location {
    id: number;
    location: string;
}