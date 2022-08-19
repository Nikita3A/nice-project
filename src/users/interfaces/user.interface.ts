import { File } from "@google-cloud/storage";

export interface User {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    isEmailVerified?: boolean;
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

export interface UserEmailConfirmation  {
    email: string;
    name: string;
}

export interface UserDataFromToken {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface UpdateUser {
    name?: string;
    password?: string;
    avatar?: File;
}