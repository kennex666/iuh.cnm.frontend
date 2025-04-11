import {Domains} from './../../constants/ApiConstant';
import axios from 'axios';
import {User} from '@/src/models/User';
import {AuthStorage} from '@/src/services/AuthStorage';

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

            const response = otp
                ? await axios.post<LoginResponse>(
                    `${Domains.API_AUTH}/login-2fa`,
                    {
                        phone,
                        password,
                        otp,
                    }
                )
                : await axios.post<LoginResponse>(
                    `${Domains.API_AUTH}/login`,
                    {
                        phone,
                        password,
                    }
                );

            console.log("API response status:", response.status);

            if (response.data.success) {
                const {accessToken, refreshToken, user} = response.data.data;

                // Transform API user to app User model
                const appUser: Partial<User> = {
                    id: user.id,
                    name: user.name,
                    email: user.email || "",
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
                message:
                    error.response?.data?.errorMessage ||
                    error.message ||
                    "Network error occurred",
            };
        }
    },
    async forgotPassword({
                             phone = "",
                             otp = "",
                             password = "",
                         }: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const response = await axios.post(
                `${Domains.API_AUTH}/forgot-password`,
                {
                    phone,
                    otp,
                    password,
                }
            );

            if (response.data.errorCode == 200) {
                return {success: true};
            }
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
                `${Domains.API_AUTH}/register`,
                {
                    name,
                    phone,
                    gender,
                    password,
                    dob,
                }
            );

            if (response.data.errorCode == 200) {
                return {success: true};
            }
            return {success: false, message: response.data.errorMessage};
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
                `${Domains.API_AUTH}/verify-account`,
                {
                    phone,
                    otp,
                }
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
                `${Domains.API_AUTH}/resend-otp`,
                {
                    phone,
                }
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

    // {{HOST}}/api/auth/devices -> jwt to get list devices active
    async getDevices(): Promise<{
        success: boolean;
        data?: any[];
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {success: false, message: "No access token found"};
            }

            const response = await axios.get(`${Domains.API_AUTH}/devices`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {success: true, data: response.data.data};
            }
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Get devices error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    // {{HOST}}/api/auth/logout-all
    async logoutAll(): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {success: false, message: "No access token found"};
            }

            const response = await axios.get(
                `${Domains.API_AUTH}/logout-all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                return {success: true};
            }
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Logout all error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    // logout-device -> post deviceId
    async logoutDevice({deviceId}: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {success: false, message: "No access token found"};
            }

            const response = await axios.post(
                `${Domains.API_AUTH}/logout-device`,
                {
                    deviceId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                return {success: true};
            }
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Logout device error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    // router.post("/2fa/enable", authMiddleware, AuthController.enable2FA); secret, otp
    async enable2FA({secret, otp}: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {success: false, message: "No access token found"};
            }

            const response = await axios.post(
                `${Domains.API_AUTH}/2fa/enable`,
                {
                    secret,
                    otp,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                return {success: true};
            }
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Enable 2FA error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    // router.post("/2fa/disable", authMiddleware, AuthController.disable2FA);
    async disable2FA({otp}: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {success: false, message: "No access token found"};
            }

            const response = await axios.post(
                `${Domains.API_AUTH}/2fa/disable`,
                {
                    otp,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                return {success: true};
            }
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Disable 2FA error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    async get2FAStatus(): Promise<{
        success: boolean;
        data?: {
            isEnabled: boolean;
        };
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {success: false, message: "No access token found"};
            }

            const response = await axios.get(
                `${Domains.API_AUTH}/2fa/status`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                return {success: true, data: response.data.data};
            }
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Get 2FA status error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

    // change-password {oldPassword, newPassword}
    async changePassword({
                             oldPassword,
                             newPassword,
                         }: any): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {success: false, message: "No access token found"};
            }

            const response = await axios.post(
                `${Domains.API_AUTH}/change-password`,
                {
                    oldPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                return {success: true};
            }
            return {success: false, message: response.data.errorMessage};
        } catch (error: any) {
            console.error("Change password error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred",
            };
        }
    },

};