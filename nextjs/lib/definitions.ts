export interface SessionPayLoad {
    userId: number;
    email?: string;
    preferences?: number[];
    expiresAt: number;
    [key: string]: unknown;
}

export interface User {
    id: number;
    email: string;
    preferences?: number[];
}