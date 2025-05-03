import { ApiEndpoints } from "@/src/constants/ApiConstant";
import { Reaction } from "@/src/models/Reaction";
import { BaseService } from "./BaseService";
import { AxiosRequestConfig } from "axios";

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
    async getAllReactions() {
        try {
            const response = await BaseService.authenticatedRequest<any[]>(
                'get',
                ApiEndpoints.API_REACTION
            );

            if (!response.success || !response.data) {
                return {
                    success: false,
                    reactions: [],
                    message: response.message || "Failed to fetch reactions"
                };
            }

            const reactions = response.data.map(mapApiReactionToModel);

            return {
                success: true,
                reactions,
                message: response.message || "Successfully fetched reactions"
            };
        } catch (error: any) {
            console.error("Get reactions error:", error);
            return {
                success: false,
                reactions: [],
                message: error.message || "Failed to get reactions"
            };
        }
    },

    async getReactionById(id: string) {
        try {
            const response = await BaseService.authenticatedRequest<any>(
                'get',
                `${ApiEndpoints.API_REACTION}/${id}`
            );

            if (!response.success || !response.data) {
                return {
                    success: false,
                    reaction: {} as Reaction,
                    message: response.message || "Failed to fetch reaction"
                };
            }

            const reaction = mapApiReactionToModel(response.data);

            return {
                success: true,
                reaction,
                message: response.message || "Successfully fetched reaction"
            };
        } catch (error: any) {
            console.error("Get reaction error:", error);
            return {
                success: false,
                reaction: {} as Reaction,
                message: error.message || "Failed to get reaction"
            };
        }
    },

    async createReaction(reaction: Reaction) {
        try {
            // Use FormData for multipart/form-data uploads
            const formData = new FormData();
            formData.append('messageId', reaction.messageId);
            formData.append('userId', reaction.userId);
            formData.append('emoji', reaction.emoji);

            // Config for multipart/form-data
            const config: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await BaseService.authenticatedRequest<any>(
                'post',
                ApiEndpoints.API_REACTION,
                formData,
                config
            );

            if (!response.success || !response.data) {
                return {
                    success: false,
                    reaction: {} as Reaction,
                    message: response.message || "Failed to create reaction"
                };
            }

            const newReaction = mapApiReactionToModel(response.data);

            return {
                success: true,
                reaction: newReaction,
                message: response.message || "Successfully created reaction"
            };
        } catch (error: any) {
            console.error("Create reaction error:", error);
            return {
                success: false,
                reaction: {} as Reaction,
                message: error.message || "Failed to create reaction"
            };
        }
    },

    async deleteReaction(id: string) {
        try {
            const response = await BaseService.authenticatedRequest<void>(
                'delete',
                `${ApiEndpoints.API_REACTION}/${id}`
            );

            return {
                success: response.success,
                message: response.message || (response.success ?
                    "Successfully deleted reaction" : "Failed to delete reaction")
            };
        } catch (error: any) {
            console.error("Delete reaction error:", error);
            return {
                success: false,
                message: error.message || "Failed to delete reaction"
            };
        }
    }
};

function mapApiReactionToModel(apiReaction: any): Reaction {
    return {
        id: apiReaction.id || apiReaction._id,
        messageId: apiReaction.messageId,
        userId: apiReaction.userId,
        emoji: apiReaction.emoji,
        createdAt: apiReaction.createdAt,
        updatedAt: apiReaction.updatedAt
    };
}