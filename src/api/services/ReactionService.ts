import axios from "axios";
import { ApiEndpoints } from "@/src/constants/ApiConstant";
import { AuthStorage } from "@/src/services/AuthStorage";
import { Reaction } from "@/src/models/Reaction";

interface ReactionService {
    getAllReactions: () => Promise<{
        success: boolean;
        reactions: Reaction[];
        message: string;
    }>;
    getReactionById: (id: string) => Promise<{
        success: boolean;
        reaction: Reaction;
        message: string;
    }>;
    createReaction: (reaction: Reaction) => Promise<{
        success: boolean;
        reaction: Reaction;
        message: string;
    }>;
    deleteReaction: (id: string) => Promise<{
        success: boolean;
        message: string;
    }>;
}

export const ReactionService: ReactionService = {
    async getAllReactions(): Promise<{
        success: boolean;
        reactions: Reaction[];
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    reactions: [],
                    message: "No token found",
                };
            }

            const response = await axios.get(ApiEndpoints.API_REACTION, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const reactions = response.data.data.map((apiReaction: any) => ({
                    id: apiReaction.id,
                    messageId: apiReaction.messageId,
                    userId: apiReaction.userId,
                    emoji: apiReaction.emoji,
                    createdAt: apiReaction.createdAt,
                    updatedAt: apiReaction.updatedAt
                }));
                return { 
                    success: true, 
                    reactions, 
                    message: response.data.message || "Successfully fetched reactions" 
                };
            }
            return { 
                success: false, 
                reactions: [], 
                message: response.data.message || "Failed to fetch reactions" 
            };
        } catch (error) {
            console.error("Get reactions error:", error);
            return {
                success: false,
                reactions: [],
                message: "Failed to get reactions",
            };
        }
    },

    async getReactionById(id: string): Promise<{
        success: boolean;
        reaction: Reaction;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    reaction: {} as Reaction,
                    message: "No token found",
                };
            }

            const response = await axios.get(`${ApiEndpoints.API_REACTION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const apiReaction = response.data.data;
                const reaction: Reaction = {
                    id: apiReaction.id,
                    messageId: apiReaction.messageId,
                    userId: apiReaction.userId,
                    emoji: apiReaction.emoji,
                    createdAt: apiReaction.createdAt,
                    updatedAt: apiReaction.updatedAt
                };

                return { 
                    success: true, 
                    reaction, 
                    message: response.data.message || "Successfully fetched reaction" 
                };
            }
            return { 
                success: false, 
                reaction: {} as Reaction, 
                message: response.data.message || "Failed to fetch reaction" 
            };
        } catch (error) {
            console.error("Get reaction error:", error);
            return {
                success: false,
                reaction: {} as Reaction,
                message: "Failed to get reaction",
            };
        }
    },

    async createReaction(reaction: Reaction): Promise<{
        success: boolean;
        reaction: Reaction;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    reaction: {} as Reaction,
                    message: "No token found",
                };
            }

            const formData = new FormData();
            formData.append('messageId', reaction.messageId);
            formData.append('userId', reaction.userId);
            formData.append('emoji', reaction.emoji);

            const response = await axios.post(ApiEndpoints.API_REACTION, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const apiReaction = response.data.data;
                const newReaction: Reaction = {
                    id: apiReaction.id,
                    messageId: apiReaction.messageId,
                    userId: apiReaction.userId,
                    emoji: apiReaction.emoji,
                    createdAt: apiReaction.createdAt,
                    updatedAt: apiReaction.updatedAt
                };

                return { 
                    success: true, 
                    reaction: newReaction, 
                    message: response.data.message || "Successfully created reaction" 
                };
            }
            return { 
                success: false, 
                reaction: {} as Reaction, 
                message: response.data.message || "Failed to create reaction" 
            };
        } catch (error) {
            console.error("Create reaction error:", error);
            return {
                success: false,
                reaction: {} as Reaction,
                message: "Failed to create reaction",
            };
        }
    },

    async deleteReaction(id: string): Promise<{
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

            const response = await axios.delete(`${ApiEndpoints.API_REACTION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return { 
                    success: true, 
                    message: response.data.message || "Successfully deleted reaction" 
                };
            }
            return { 
                success: false, 
                message: response.data.message || "Failed to delete reaction" 
            };
        } catch (error) {
            console.error("Delete reaction error:", error);
            return {
                success: false,
                message: "Failed to delete reaction",
            };
        }
    }
}; 