import {User} from '@/src/models/User';
import {ApiEndpoints} from '@/src/constants/ApiConstant';
import {BaseService, ExtendedAxiosRequestConfig} from './BaseService';

interface UserService {
    update: (userData: Partial<User>) => Promise<{
        success: boolean;
        user?: User;
        message: string;
    }>;
    me: () => Promise<{
        success: boolean;
        user?: User;
        message: string;
    }>;
    getUserById: (userId: string) => Promise<{
        success: boolean;
        user?: User;
        message: string;
    }>;
    getUserByPhone: (phone: string) => Promise<{
        success: boolean;
        users?: User[];
        message: string;
    }>;
}

export const UserService: UserService = {
    async update(userData: Partial<User>) {
        try {
            // Format date if present
            if (userData.dob) userData.dob = new Date(userData.dob).toISOString();

            const response = await BaseService.authenticatedRequest<any>(
                'put',
                `${ApiEndpoints.API_USER}/update`,
                userData
            );

            if (!response.success || !response.data) {
                return {
                    success: false,
                    message: response.message || "Update failed"
                };
            }

            const appUser = mapApiUserToModel(response.data);

            return {
                success: true,
                user: appUser,
                message: response.message || "User updated successfully"
            };
        } catch (error: any) {
            console.error("Update user error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred"
            };
        }
    },

    async me() {
        try {
            const response = await BaseService.authenticatedRequest<any>(
                'get',
                `${ApiEndpoints.API_AUTH}/me`
            );

            if (!response.success || !response.data) {
                return {
                    success: false,
                    message: response.message || "Failed to fetch user profile"
                };
            }

            const appUser = mapApiUserToModel(response.data);

            return {
                success: true,
                user: appUser,
                message: response.message || "User profile retrieved successfully"
            };
        } catch (error: any) {
            console.error("Get current user error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred"
            };
        }
    },

    async getUserById(userId: string) {
        try {
            const response = await BaseService.authenticatedRequest<any>(
                'get',
                `${ApiEndpoints.API_USER}/${userId}`
            );

            if (!response.success || !response.data) {
                return {
                    success: false,
                    message: response.message || "Failed to fetch user profile"
                };
            }

            const appUser = mapApiUserToModel(response.data);

            return {
                success: true,
                user: appUser,
                message: response.message || "User profile retrieved successfully"
            };
        } catch (error: any) {
            console.error("Get user by ID error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred"
            };
        }
    },

    async getUserByPhone(phone: string) {
        try {
            const config: ExtendedAxiosRequestConfig = {skipAuth: true};

            const response = await BaseService.authenticatedRequest<any[]>(
                'get',
                `${ApiEndpoints.API_USER}/search?q=${phone}`,
                null,
                config
            );

            if (!response.success || !response.data) {
                return {
                    success: false,
                    message: response.message || "Failed to fetch users"
                };
            }

            const appUsers = response.data.map(mapApiUserToModel);

            return {
                success: true,
                users: appUsers,
                message: response.message || "Users retrieved successfully"
            };
        } catch (error: any) {
            console.error("Get user by phone error:", error);
            return {
                success: false,
                message: error.message || "Network error occurred"
            };
        }
    }
};

function mapApiUserToModel(apiUser: any): User {
    return {
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
    };
}