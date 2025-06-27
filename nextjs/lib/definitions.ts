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
    url: String;
    title: String;
    date_posted: String;
    location: String;
    description: String;
    content: String;
    keywords: Keyword[];
}

export interface Keyword {
    score: number;
    keyword: string;
}
