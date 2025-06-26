export interface SessionPayLoad {
    userId: number;
    email?: string;
    preferences?: string[];
    expiresAt: number;
    [key: string]: unknown;
}