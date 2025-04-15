import axios from "axios";
import { ApiEndpoints } from "@/src/constants/ApiConstant";
import { AuthStorage } from "@/src/services/AuthStorage";
import FriendRequest from "@/src/models/FriendRequest";
import {User} from '@/src/models/User';

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
    createFriendRequest: (friendRequest: FriendRequest) => Promise<{
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
}

export const FriendRequestService: FriendRequestService = {
    async getAllFriendRequests(): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    friendRequests: [],
                    message: "No token found",
                };
            }

            const response = await axios.get(ApiEndpoints.API_FRIEND_REQUEST, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {
                    success: true,
                    friendRequests: response.data.data,
                    message: response.data.message || "Successfully fetched friend requests",
                };
            }
            return {
                success: false,
                friendRequests: [],
                message: response.data.message || "Failed to fetch friend requests",
            };
        } catch (error) {
            console.error("Get friend requests error:", error);
            return {
                success: false,
                friendRequests: [],
                message: "Failed to get friend requests",
            };
        }
    },

    async getFriendRequestById(id: string): Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    friendRequest: {} as FriendRequest,
                    message: "No token found",
                };
            }

            const response = await axios.get(`${ApiEndpoints.API_FRIEND_REQUEST}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {
                    success: true,
                    friendRequest: response.data.data,
                    message: response.data.message || "Successfully fetched friend request",
                };
            }
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: response.data.message || "Failed to fetch friend request",
            };
        } catch (error) {
            console.error("Get friend request error:", error);
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: "Failed to get friend request",
            };
        }
    },

    async createFriendRequest(friendRequest: FriendRequest): Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    friendRequest: {} as FriendRequest,
                    message: "No token found",
                };
            }

            const response = await axios.post(ApiEndpoints.API_FRIEND_REQUEST, friendRequest, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {
                    success: true,
                    friendRequest: response.data.data,
                    message: response.data.message || "Successfully created friend request",
                };
            }
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: response.data.message || "Failed to create friend request",
            };
        } catch (error) {
            console.error("Create friend request error:", error);
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: "Failed to create friend request",
            };
        }
    },

    async acceptFriendRequest(id: string): Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    friendRequest: {} as FriendRequest,
                    message: "No token found",
                };
            }

            const response = await axios.put(`${ApiEndpoints.API_FRIEND_REQUEST}/accept/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {
                    success: true,
                    friendRequest: response.data.data,
                    message: response.data.message || "Successfully accepted friend request",
                };
            }
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: response.data.message || "Failed to accept friend request",
            };
        } catch (error) {
            console.error("Accept friend request error:", error);
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: "Failed to accept friend request",
            };
        }
    },

    async declineFriendRequest(id: string): Promise<{
        success: boolean;
        friendRequest: FriendRequest;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    friendRequest: {} as FriendRequest,
                    message: "No token found",
                };
            }

            const response = await axios.put(`${ApiEndpoints.API_FRIEND_REQUEST}/decline/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {
                    success: true,
                    friendRequest: response.data.data,
                    message: response.data.message || "Successfully declined friend request",
                };
            }
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: response.data.message || "Failed to decline friend request",
            };
        } catch (error) {
            console.error("Decline friend request error:", error);
            return {
                success: false,
                friendRequest: {} as FriendRequest,
                message: "Failed to decline friend request",
            };
        }
    },

    async deleteFriendRequest(id: string): Promise<{
        success: boolean;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    message: "No token found",
                };
            }

            const response = await axios.delete(`${ApiEndpoints.API_FRIEND_REQUEST}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message || "Successfully deleted friend request",
                };
            }
            return {
                success: false,
                message: response.data.message || "Failed to delete friend request",
            };
        } catch (error) {
            console.error("Delete friend request error:", error);
            return {
                success: false,
                message: "Failed to delete friend request",
            };
        }
    },

    async getAllPendingFriendRequests(userId: string): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    friendRequests: [],
                    message: "No token found",
                };
            }

            const response = await axios.get(`${ApiEndpoints.API_FRIEND_REQUEST}/pending/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {
                    success: true,
                    friendRequests: response.data.data,
                    message: response.data.message || "Successfully fetched pending friend requests",
                };
            }
            return {
                success: false,
                friendRequests: [],
                message: response.data.message || "Failed to fetch pending friend requests",
            };
        } catch (error) {
            console.error("Get pending friend requests error:", error);
            return {
                success: false,
                friendRequests: [],
                message: "Failed to get pending friend requests",
            };
        }
    },

    async getAllAcceptedFriendRequests(userId: string): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    friendRequests: [],
                    message: "No token found",
                };
            }

            const response = await axios.get(`${ApiEndpoints.API_FRIEND_REQUEST}/accepted/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {
                    success: true,
                    friendRequests: response.data.data,
                    message: response.data.message || "Successfully fetched accepted friend requests",
                };
            }
            return {
                success: false,
                friendRequests: [],
                message: response.data.message || "Failed to fetch accepted friend requests",
            };
        } catch (error) {
            console.error("Get accepted friend requests error:", error);
            return {
                success: false,
                friendRequests: [],
                message: "Failed to get accepted friend requests",
            };
        }
    },

    async getAllDeclinedFriendRequests(userId: string): Promise<{
        success: boolean;
        friendRequests: FriendRequest[];
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    friendRequests: [],
                    message: "No token found",
                };
            }

            const response = await axios.get(`${ApiEndpoints.API_FRIEND_REQUEST}/decline/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return {
                    success: true,
                    friendRequests: response.data.data,
                    message: response.data.message || "Successfully fetched declined friend requests",
                };
            }
            return {
                success: false,
                friendRequests: [],
                message: response.data.message || "Failed to fetch declined friend requests",
            };
        } catch (error) {
            console.error("Get declined friend requests error:", error);
            return {
                success: false,
                friendRequests: [],
                message: "Failed to get declined friend requests",
            };
        }
    },
}; 