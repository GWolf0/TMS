import { UserRole } from "./enums";

// JSON type
export type JSONType<T = any> = {[key: string]: T};

// MError
export type MError = {
    message?: string,
    errors?: JSONType<string>,
} | null;

// Data or Error
export interface DOE<T = null>{
    data?: T,
    error: MError,
}

// Pagination
export interface PaginationInfo{
    total: number,
    per_page: number,
    current_page: number,
    last_page: number,
}
export type PaginatedData<T = any> = { data: T[] } & PaginationInfo;

// HTTP Request
export type HTTPMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HTTPRequest{
    url: string,
    method: HTTPMethodType,
    allowedRoles?: UserRole[] | null, // if roles are undefined then allow any, else if null then allow not authenticated users
}