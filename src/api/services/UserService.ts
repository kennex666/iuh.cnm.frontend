import axios from 'axios';
import {User} from '@/src/models/User';
import {AuthStorage} from '@/src/services/AuthStorage';
import {ApiEndpoints} from '@/src/constants/ApiConstant';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const UserService = {
    async update(userData: Partial<User>): Promise<{
        success: boolean;
        user?: User;
        message?: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    message: "No access token found"
                };
            }

            if (userData.dob) userData.dob = new Date(userData.dob).toISOString();

            const response = await axios.put(
                `${ApiEndpoints.API_USER}/update`,
                userData,
                {headers: {Authorization: `Bearer ${token}`}}
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

                return {
                    success: true,
                    user: appUser
                };
            }

            return {
                success: false,
                message: response.data.errorMessage || "Update failed"
            };
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
                return {
                    success: false,
                    message: "No access token found"
                };
            }

            const response = await axios.get(
                `${ApiEndpoints.API_AUTH}/me`,
                {headers: {Authorization: `Bearer ${token}`}}
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
                message: error.response?.data?.errorMessage || error.message || "Network error occurred",
            };
        }
    },
    getUserById: async (userId: string): Promise<{
        success: boolean;
        user?: User;
        message?: string;
    }> => {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    message: "No access token found"
                };
            }
            const response = await axios.get(
                `${ApiEndpoints.API_USER}/${userId}`,
                {headers: {Authorization: `Bearer ${token}`}}
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
        }
        catch (error: any) {
            console.error("Get user by ID error:", error);
            return {
                success: false,
                message: error.response?.data?.errorMessage || error.message || "Network error occurred",
            };
        }
    },
    // get user by phone
    //http://localhost:8087/api/user/search?q=0388889221
    getUserByPhone: async (phone: string): Promise<{
        success: boolean;
        users?: User[];
        message?: string;
    }> => {
        try {
            const response = await axios.get(
                `${ApiEndpoints.API_USER}/search?q=${phone}`
            );
            console.log("Data of response", response.data);
            if (response.data.success) {
                const apiUsers = response.data.data;
                const appUsers: User[] = apiUsers.map((apiUser: any) => ({
                    id: apiUser.id,
                    name: apiUser.name,
                    email: apiUser.email || "",
                    phone: apiUser.phone,
                    gender: apiUser.gender,
                    password: "",
                    avatarURL: apiUser.avatarUrl || "default",
                    coverURL: apiUser.coverUrl || "default",
                    dob: apiUser.dob,
                    isOnline: apiUser.isOnline,
                    createdAt: apiUser.createdAt,
                    updatedAt: apiUser.updatedAt,
                }));
                return {success: true, users: appUsers};
            }
            return {
                success: false,
                message: response.data.errorMessage || "Failed to fetch user profile"
            };
        }
        catch (error: any) {
            console.error("Get user by phone error:", error);
            return {
                success: false,
                message: error.response?.data?.errorMessage || error.message || "Network error occurred",
            };
        }
    }
};