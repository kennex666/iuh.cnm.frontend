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

export const FriendRequestService = {
    async getAllFriendRequests(): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
        const response = await BaseService.authenticatedRequest<FriendRequest[]>(
            'get',
            ApiEndpoints.API_FRIEND_REQUEST
        );

        return {
            success: response.success,
            friendRequests: response.data || [],
            message: response.message
        };
    },

    async getFriendRequestById(id: string): Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }> {
        const response = await BaseService.authenticatedRequest<FriendRequest>(
            'get',
            `${ApiEndpoints.API_FRIEND_REQUEST}/${id}`
        );

        return {
            success: response.success,
            friendRequest: response.data || ({} as FriendRequest),
            message: response.message
        };
    },

    async createFriendRequest(friendRequest: FriendRequest): Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }> {
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
    },

    async acceptFriendRequest(id: string): Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }> {
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
    },

    async declineFriendRequest(id: string): Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }> {
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
    },

    async deleteFriendRequest(id: string): Promise<{
        success: boolean;
        message: string;
    }> {
        const response = await BaseService.authenticatedRequest<void>(
            'delete',
            `${ApiEndpoints.API_FRIEND_REQUEST}/${id}`
        );

        return {
            success: response.success,
            message: response.message
        };
    },

    async getAllPendingFriendRequests(userId: string): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
        const response = await BaseService.authenticatedRequest<FriendRequest[]>(
            'get',
            `${ApiEndpoints.API_FRIEND_REQUEST}/pending/receiver`
        );

        return {
            success: response.success,
            friendRequests: response.data || [],
            message: response.message
        };
    },

    async getAllAcceptedFriendRequests(userId: string): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
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
    },

    async getAllDeclinedFriendRequests(userId: string): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
        const response = await BaseService.authenticatedRequest<FriendRequest[]>(
            'get',
            `${ApiEndpoints.API_FRIEND_REQUEST}/decline/${userId}`
        );

        return {
            success: response.success,
            friendRequests: response.data || [],
            message: response.message
        };
    },

    async getAllPendingFriendRequestsByReceiverId(receiverId: string): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
        const response = await BaseService.authenticatedRequest<FriendRequest[]>(
            'get',
            `${ApiEndpoints.API_FRIEND_REQUEST}/pending/receiver`
        );

        return {
            success: response.success,
            friendRequests: response.data || [],
            message: response.message
        };
    },

    async getAllPendingFriendRequestsBySenderId(): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
        const response = await BaseService.authenticatedRequest<FriendRequest[]>(
            'get',
            `${ApiEndpoints.API_FRIEND_REQUEST}/pending/sender`
        );

        return {
            success: response.success,
            friendRequests: response.data || [],
            message: response.message
        };
    }
};