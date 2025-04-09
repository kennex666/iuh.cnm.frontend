import axios from 'axios';
import { User } from '@/src/models/User';

const API_URL = 'http://192.168.1.25:8087/api';

export interface LoginResponse {
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            _id: string;
            name: string;
            email: string | null;
            phone: string;
            gender: string;
            avatarUrl: string;
            coverUrl: string;
            dob: string;
            isOnline: boolean;
            createdAt: string;
            updatedAt: string;
            __v: number;
            id: string;
        }
    };
    errorCode: number;
    success: boolean;
    errorMessage: string;
}

export const authService = {
    async login(phone: string, password: string): Promise<{
        success: boolean;
        user?: Partial<User>;
        accessToken?: string;
        refreshToken?: string;
        message?: string
    }> {
        try {
            console.log('Calling login API with:', { phone, password });

            const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
                phone,
                password,
            });

            console.log('API response status:', response.status);

            if (response.data.success) {
                const { accessToken, refreshToken, user } = response.data.data;

                // Transform API user to app User model
                const appUser: Partial<User> = {
                    id: user.id,
                    name: user.name,
                    email: user.email || '',
                    phone: user.phone,
                    gender: user.gender,
                    avatarURL: user.avatarUrl,
                    coverURL: user.coverUrl,
                    dob: new Date(user.dob).getTime(),
                    isOnline: user.isOnline,
                    createdAt: new Date(user.createdAt).getTime(),
                    updatedAt: new Date(user.updatedAt).getTime(),
                };

                return {
                    success: true,
                    user: appUser,
                    accessToken,
                    refreshToken
                };
            }

            return {
                success: false,
                message: response.data.errorMessage || 'Login failed'
            };
        } catch (error: any) {
            console.error('Login error details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });

            return {
                success: false,
                message: error.response?.data?.errorMessage || error.message || 'Network error occurred'
            };
        }
    }
};