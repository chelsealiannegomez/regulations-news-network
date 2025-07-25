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
    preferences?: string[];
    locations?: number[];
}

export interface Article {
    id: number;
    url: string;
    title: string;
    date_posted: Date;
    location: string;
    description: string;
    summary: string;
    content: string[];
    keywords: string[];
}

export interface Preference {
    id: number;
    topic: string;
}

export interface Location {
    id: number;
    location: string;
}
