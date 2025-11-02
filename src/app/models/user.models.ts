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

export interface PaginatedResponse<T> {
    page: number;
    pageSize: number;
    total: number;
    items: T[];
}