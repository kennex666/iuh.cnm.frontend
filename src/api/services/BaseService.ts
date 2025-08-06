import axios, {AxiosRequestConfig} from "axios";
import {AuthStorage} from "@/src/storage/AuthStorage";

export interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    message: string;
}

export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
    skipAuth?: boolean;
    isFormData?: boolean;
}

export class BaseService {
    public static async getAuthHeaders(): Promise<{ Authorization: string } | undefined> {
        const token = await AuthStorage.getAccessToken();
        if (!token) return undefined;
        return {Authorization: `Bearer ${token}`};
    }

    public static async authenticatedRequest<T>(
        method: 'get' | 'post' | 'put' | 'delete',
        url: string,
        data?: any,
        config?: ExtendedAxiosRequestConfig | boolean
    ): Promise<ServiceResponse<T>> {
        try {
            // Handle the case when config is a boolean (legacy support)
            let requestConfig: ExtendedAxiosRequestConfig = {};
            if (typeof config === 'boolean') {
                // If true was passed, it meant isFormData previously
                requestConfig = {
                    isFormData: config,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };
            } else if (config) {
                // Use the config object as provided
                requestConfig = config;

                // If isFormData flag is set, ensure proper Content-Type header
                if (config.isFormData) {
                    requestConfig.headers = {
                        ...requestConfig.headers,
                        'Content-Type': 'multipart/form-data'
                    };
                }
            }

            // Only get auth headers if skipAuth is not true
            if (!requestConfig.skipAuth) {
                const headers = await this.getAuthHeaders();
                if (!headers) {
                    return {
                        success: false,
                        message: "No token found"
                    };
                }

                requestConfig.headers = {
                    ...requestConfig.headers,
                    ...headers
                };
            }

            // Remove custom properties to avoid axios warnings
            const axiosConfig: AxiosRequestConfig = {...requestConfig};
            delete (axiosConfig as any).skipAuth;
            delete (axiosConfig as any).isFormData;

            let response;
            switch (method) {
                case 'get':
                    response = await axios.get(url, axiosConfig);
                    break;
                case 'post':
                    response = await axios.post(url, data, axiosConfig);
                    break;
                case 'put':
                    response = await axios.put(url, data, axiosConfig);
                    break;
                case 'delete':
                    response = await axios.delete(url, axiosConfig);
                    break;
            }

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || `Operation completed successfully`
                };
            }

            return {
                success: false,
                message: response.data.message || "Operation failed"
            };
        } catch (error: any) {
            console.error(`${method.toUpperCase()} request error to ${url}:`, error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || "Network error occurred"
            };
        }
    }
}