import { ApiEndpoints } from '@/src/constants/ApiConstant';
import { User } from '@/src/models/User';
import { BaseService } from './BaseService';
import axios from 'axios';

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

export const AuthService = {
    async login({phone, password, otp = null}: any): Promise<{
        success: boolean;
        user?: Partial<User>;
        accessToken?: string;
        refreshToken?: string;
        message?: string;
        errorCode?: number | string;
    }> {
        try {
            console.log("Calling login API with:", {phone, password});

            const endpoint = otp
                ? `${ApiEndpoints.API_AUTH}/login-2fa`
                : `${ApiEndpoints.API_AUTH}/login`;

            const response = await axios.post<LoginResponse>(
                endpoint,
                otp ? {phone, password, otp} : {phone, password}
            );

            if (response.data.success) {
                const {accessToken, refreshToken, user} = response.data.data;

                const appUser: Partial<User> = {
                    id: user.id,
                    name: user.name,
                    email: user.email || "",
                    phone: user.phone,
                    gender: user.gender,
                    avatarURL: user.avatarUrl,
                    coverURL: user.coverUrl,
                    dob: user.dob,
                    isOnline: user.isOnline,
                    createdAt: user.dob,
                    updatedAt: user.dob,
                };

                return {
                    success: true,
                    user: appUser,
                    accessToken,
                    refreshToken,
                };
            }

            return {
                success: false,
                message: response.data.errorMessage || "Login failed",
                errorCode: response?.data?.errorCode || 0,
            };
        } catch (error: any) {
            console.error("Login error details:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });

            return {
                success: false,
                message: error.response?.data?.errorMessage || error.message || "Network error occurred",
            };
        }
    },

    async forgotPassword({phone = "", otp = "", password = ""}: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const response = await axios.post(
                `${ApiEndpoints.API_AUTH}/forgot-password`,
                {phone, otp, password}
            );

            if (response.data.errorCode == 200) return {success: true};
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Forgot password error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    async register({name, phone, gender, password, dob}: any): Promise<{
        success: boolean;
        message?: string;
        errorCode?: number | string;
    }> {
        try {
            const response = await axios.post(
                `${ApiEndpoints.API_AUTH}/register`,
                {name, phone, gender, password, dob}
            );

            if (response.data.errorCode == 200) {
                return {success: true};
            }
            return {
                success: false,
                message: response.data.errorMessage
            };
        } catch (error: any) {
            console.error("Register error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    async verifyAccount({phone, otp}: any): Promise<{
        success: boolean;
        message?: string;
        errorCode?: number | string;
    }> {
        try {
            const response = await axios.post(
                `${ApiEndpoints.API_AUTH}/verify-account`,
                {phone, otp}
            );

            if (response.data.errorCode == 200) {
                return {success: true};
            }
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Verify account error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    async resendOtp({phone}: any): Promise<{
        success: boolean;
        message?: string;
        errorCode?: number | string;
    }> {
        try {
            const response = await axios.post(
                `${ApiEndpoints.API_AUTH}/resend-otp`,
                {phone}
            );

            if (response.data.errorCode == 200) {
                return {success: true};
            }
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Resend OTP error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    async getDevices(): Promise<{
        success: boolean;
        data?: any[];
        message?: string;
    }> {
        const response = await BaseService.authenticatedRequest<any[]>(
            'get',
            `${ApiEndpoints.API_AUTH}/devices`
        );

        return {
            success: response.success,
            data: response.data,
            message: response.message
        };
    },

    async logoutAll(): Promise<{
        success: boolean;
        message?: string;
    }> {
        const response = await BaseService.authenticatedRequest<void>(
            'get',
            `${ApiEndpoints.API_AUTH}/logout-all`
        );

        return {
            success: response.success,
            message: response.message
        };
    },

    async logoutDevice({deviceId}: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        const response = await BaseService.authenticatedRequest<void>(
            'post',
            `${ApiEndpoints.API_AUTH}/logout-device`,
            {deviceId}
        );

        return {
            success: response.success,
            message: response.message
        };
    },

    async enable2FA({secret, otp}: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        const response = await BaseService.authenticatedRequest<void>(
            'post',
            `${ApiEndpoints.API_AUTH}/2fa/enable`,
            {secret, otp}
        );

        return {
            success: response.success,
            message: response.message
        };
    },

    async disable2FA({otp}: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        const response = await BaseService.authenticatedRequest<void>(
            'post',
            `${ApiEndpoints.API_AUTH}/2fa/disable`,
            {otp}
        );

        return {
            success: response.success,
            message: response.message
        };
    },

    async get2FAStatus(): Promise<{
        success: boolean;
        data?: { isEnabled: boolean; };
        message?: string;
    }> {
        const response = await BaseService.authenticatedRequest<{ isEnabled: boolean }>(
            'get',
            `${ApiEndpoints.API_AUTH}/2fa/status`
        );

        return {
            success: response.success,
            data: response.data,
            message: response.message
        };
    },

    async changePassword({oldPassword, newPassword}: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        const response = await BaseService.authenticatedRequest<void>(
            'post',
            `${ApiEndpoints.API_AUTH}/change-password`,
            {oldPassword, newPassword}
        );

        return {
            success: response.success,
            message: response.message
        };
    }
};