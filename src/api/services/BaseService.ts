import axios, { AxiosRequestConfig } from "axios";
import { AuthStorage } from "@/src/storage/AuthStorage";

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

export class BaseService {
  public static async getAuthHeaders(): Promise<{ Authorization: string } | undefined> {
    const token = await AuthStorage.getAccessToken();
    if (!token) return undefined;
    return { Authorization: `Bearer ${token}` };
  }

    public static async authenticatedRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ServiceResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      if (!headers) {
        return {
          success: false,
          message: "No token found"
        };
      }

      const requestConfig: AxiosRequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          ...headers
        }
      };

      let response;
      switch (method) {
        case 'get':
          response = await axios.get(url, requestConfig);
          break;
        case 'post':
          response = await axios.post(url, data, requestConfig);
          break;
        case 'put':
          response = await axios.put(url, data, requestConfig);
          break;
        case 'delete':
          response = await axios.delete(url, requestConfig);
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