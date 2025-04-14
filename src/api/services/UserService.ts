import axios from 'axios';
import {User} from '@/src/models/User';
import {AuthStorage} from '@/src/services/AuthStorage';
import {ApiEndpoints} from '@/src/constants/ApiConstant';

export const UserService = {
    async update(userData: Partial<User>): Promise<{
        success: boolean;
        user?: User;
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {success: false, message: "No access token found"};
            }

            if (userData.dob) {
                userData.dob = new Date(userData.dob).toISOString();
            }

            const response = await axios.put(
                `${ApiEndpoints.API_USER}/update`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const apiUser = response.data.data;
                const appUser: User = {
                    id: apiUser.id,
                    name: apiUser.name,
                    email: apiUser.email,
                    phone: apiUser.phone,
                    gender: apiUser.gender,
                    password: "",
                    avatarURL: apiUser.avatarUrl,
                    coverURL: apiUser.coverUrl,
                    dob: apiUser.dob,
                    isOnline: apiUser.isOnline,
                    createdAt: apiUser.createdAt,
                    updatedAt: apiUser.updatedAt,
                };

                return {success: true, user: appUser};
            }

            return {success: false, message: response.data.errorMessage || "Update failed"};
        } catch (error: any) {
            console.error("Update user error:", error);
            return {
                success: false,
                message: error.response?.data?.errorMessage || error.message || "Network error occurred",
            };
        }
    },

    async me(): Promise<{
        success: boolean;
        user?: User;
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {success: false, message: "No access token found"};
            }

            const response = await axios.get(
                `${ApiEndpoints.API_AUTH}/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const apiUser = response.data.data;
                const appUser: User = {
                    id: apiUser.id,
                    name: apiUser.name,
                    email: apiUser.email || "",
                    phone: apiUser.phone,
                    gender: apiUser.gender,
                    password: "",
                    avatarURL: apiUser.avatarUrl,
                    coverURL: apiUser.coverUrl,
                    dob: apiUser.dob,
                    isOnline: apiUser.isOnline,
                    createdAt: apiUser.createdAt,
                    updatedAt: apiUser.updatedAt,
                };
                return {success: true, user: appUser};
            }
            return {
                success: false,
                message: response.data.errorMessage || "Failed to fetch user profile"
            };
        } catch (error: any) {
            console.error("Get current user error:", error);
            return {
                success: false,
                message: error.response?.data?.errorMessage ||
                    error.message ||
                    "Network error occurred",
            };
        }
    }

};