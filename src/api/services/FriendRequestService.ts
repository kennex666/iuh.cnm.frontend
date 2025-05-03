import { ApiEndpoints } from "@/src/constants/ApiConstant";
import { FriendRequest } from "@/src/models/FriendRequest";
import { BaseService } from "./BaseService";

interface FriendRequestService {
    getAllFriendRequests: () => Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }>;
    getFriendRequestById: (id: string) => Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }>;
    createFriendRequest: (friendRequest: any) => Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }>;
    acceptFriendRequest: (id: string) => Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }>;
    declineFriendRequest: (id: string) => Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }>;
    deleteFriendRequest: (id: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    getAllPendingFriendRequests: (userId: string) => Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }>;
    getAllAcceptedFriendRequests: (userId: string) => Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }>;
    getAllDeclinedFriendRequests: (userId: string) => Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }>;
    getAllPendingFriendRequestsByReceiverId: (receiverId: string) => Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }>;
    getAllPendingFriendRequestsBySenderId: () => Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }>;
}

export const FriendRequestService: FriendRequestService = {
    async getAllFriendRequests() {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest[]>(
                'get',
                ApiEndpoints.API_FRIEND_REQUEST
            );

            return {
                success: response.success,
                friendRequests: response.data || [],
                message: response.message
            };
        } catch (error: any) {
            console.error("Error fetching all friend requests:", error);
            return {
                success: false,
                friendRequests: [],
                message: error.message || "Failed to fetch friend requests"
            };
        }
    },

    async getFriendRequestById(id: string) {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest>(
                'get',
                `${ApiEndpoints.API_FRIEND_REQUEST}/${id}`
            );

            return {
                success: response.success,
                friendRequest: response.data || ({} as FriendRequest),
                message: response.message
            };
        } catch (error: any) {
            console.error(`Error fetching friend request ${id}:`, error);
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: error.message || "Failed to fetch friend request"
            };
        }
    },

    async createFriendRequest(friendRequest: FriendRequest) {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest>(
                'post',
                ApiEndpoints.API_FRIEND_REQUEST,
                friendRequest
            );

            console.log("create friend request response: ", response);

            return {
                success: response.success,
                friendRequest: response.data || ({} as FriendRequest),
                message: response.message
            };
        } catch (error: any) {
            console.error("Error creating friend request:", error);
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: error.message || "Failed to create friend request"
            };
        }
    },

    async acceptFriendRequest(id: string) {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest>(
                'put',
                `${ApiEndpoints.API_FRIEND_REQUEST}/accept/${id}`,
                {}
            );

            console.log(response);

            return {
                success: response.success,
                friendRequest: response.data || ({} as FriendRequest),
                message: response.message
            };
        } catch (error: any) {
            console.error(`Error accepting friend request ${id}:`, error);
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: error.message || "Failed to accept friend request"
            };
        }
    },

    async declineFriendRequest(id: string) {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest>(
                'put',
                `${ApiEndpoints.API_FRIEND_REQUEST}/decline/${id}`,
                {}
            );

            return {
                success: response.success,
                friendRequest: response.data || ({} as FriendRequest),
                message: response.message
            };
        } catch (error: any) {
            console.error(`Error declining friend request ${id}:`, error);
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: error.message || "Failed to decline friend request"
            };
        }
    },

    async deleteFriendRequest(id: string) {
        try {
            const response = await BaseService.authenticatedRequest<void>(
                'delete',
                `${ApiEndpoints.API_FRIEND_REQUEST}/${id}`
            );

            return {
                success: response.success,
                message: response.message
            };
        } catch (error: any) {
            console.error(`Error deleting friend request ${id}:`, error);
            return {
                success: false,
                message: error.message || "Failed to delete friend request"
            };
        }
    },

    async getAllPendingFriendRequests(userId: string) {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest[]>(
                'get',
                `${ApiEndpoints.API_FRIEND_REQUEST}/pending/receiver`
            );

            return {
                success: response.success,
                friendRequests: response.data || [],
                message: response.message
            };
        } catch (error: any) {
            console.error("Error fetching pending friend requests:", error);
            return {
                success: false,
                friendRequests: [],
                message: error.message || "Failed to fetch pending friend requests"
            };
        }
    },

    async getAllAcceptedFriendRequests(userId: string) {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest[]>(
                'get',
                `${ApiEndpoints.API_FRIEND_REQUEST}/accepted/userId`
            );

            console.log("get accepted friend requests: ", response);

            return {
                success: response.success,
                friendRequests: response.data || [],
                message: response.message
            };
        } catch (error: any) {
            console.error("Error fetching accepted friend requests:", error);
            return {
                success: false,
                friendRequests: [],
                message: error.message || "Failed to fetch accepted friend requests"
            };
        }
    },

    async getAllDeclinedFriendRequests(userId: string) {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest[]>(
                'get',
                `${ApiEndpoints.API_FRIEND_REQUEST}/decline/${userId}`
            );

            return {
                success: response.success,
                friendRequests: response.data || [],
                message: response.message
            };
        } catch (error: any) {
            console.error("Error fetching declined friend requests:", error);
            return {
                success: false,
                friendRequests: [],
                message: error.message || "Failed to fetch declined friend requests"
            };
        }
    },

    async getAllPendingFriendRequestsByReceiverId(receiverId: string) {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest[]>(
                'get',
                `${ApiEndpoints.API_FRIEND_REQUEST}/pending/receiver`
            );

            return {
                success: response.success,
                friendRequests: response.data || [],
                message: response.message
            };
        } catch (error: any) {
            console.error("Error fetching pending friend requests by receiver ID:", error);
            return {
                success: false,
                friendRequests: [],
                message: error.message || "Failed to fetch pending friend requests by receiver"
            };
        }
    },

    async getAllPendingFriendRequestsBySenderId() {
        try {
            const response = await BaseService.authenticatedRequest<FriendRequest[]>(
                'get',
                `${ApiEndpoints.API_FRIEND_REQUEST}/pending/sender`
            );

            return {
                success: response.success,
                friendRequests: response.data || [],
                message: response.message
            };
        } catch (error: any) {
            console.error("Error fetching pending friend requests by sender ID:", error);
            return {
                success: false,
                friendRequests: [],
                message: error.message || "Failed to fetch pending friend requests by sender"
            };
        }
    }
};