export interface UserInfo {
    userId: number;
    fullName: string;
    email: string;
    roles: string[];
    avatar?: string;
}

export interface UserAdmin {
    userId: number;
    fullName: string;
    email: string;
    roles: string[];
    avatar?: string;
    createdAt?: string;
    active?: boolean;
}