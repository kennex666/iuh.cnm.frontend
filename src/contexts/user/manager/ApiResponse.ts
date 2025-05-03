export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    errorCode?: number | string;
    data?: T;
}