import {ApiEndpoints} from "@/src/constants/ApiConstant";
import {Conversation} from "@/src/models/Conversation";
import {BaseService} from "@/src/api/services/BaseService";

interface ConversationService {
    getConversations: () => Promise<{
        success: boolean;
        conversations: Conversation[];
        message: string;
    }>;
    getConversationById: (id: string) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
    createConversation: (conversation: Conversation) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
    updateConversation: (id: string, conversation: Conversation) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
    deleteConversation: (id: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    addParticipants: (conversationId: string, participantIds: string[]) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
    removeParticipants: (conversationId: string, participantIds: string[]) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
    transferAdmin: (conversationId: string, newAdminId: string) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
    grantModRole: (conversationId: string, userId: string) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
    updateAllowMessaging: (conversationId: string) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
    pinMessage: (conversationId: string, messageId: string) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
    joinGroupByUrl: (url: string) => Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }>;
}

export const ConversationService: ConversationService = {
    async getConversations() {
        const response = await BaseService.authenticatedRequest<any[]>('get', ApiEndpoints.API_CONVERSATION);

        if (!response.success || !response.data) {
            return {
                success: false,
                conversations: [],
                message: response.message
            };
        }

        const conversations = response.data.map(mapApiConversationToModel);

        return {
            success: true,
            conversations,
            message: response.message
        };
    },

    async getConversationById(id: string) {
        const response = await BaseService.authenticatedRequest<any>('get', `${ApiEndpoints.API_CONVERSATION}/${id}`);

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const apiConv = response.data._doc || response.data;
        const conversation = mapApiConversationToModel(apiConv);

        return {
            success: true,
            conversation,
            message: response.message
        };
    },

    async createConversation(conversation: Conversation) {
        const response = await BaseService.authenticatedRequest<any>(
            'post',
            ApiEndpoints.API_CONVERSATION,
            conversation
        );

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const newConversation = mapApiConversationToModel(response.data);

        return {
            success: true,
            conversation: newConversation,
            message: response.message
        };
    },

    async updateConversation(id: string, conversation: Conversation) {
        const response = await BaseService.authenticatedRequest<any>(
            'put',
            `${ApiEndpoints.API_CONVERSATION}/${id}`,
            conversation
        );

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const updatedConversation = mapApiConversationToModel(response.data);

        return {
            success: true,
            conversation: updatedConversation,
            message: response.message
        };
    },

    async deleteConversation(id: string) {
        const response = await BaseService.authenticatedRequest<void>(
            'delete',
            `${ApiEndpoints.API_CONVERSATION}/${id}`
        );

        return {
            success: response.success,
            message: response.message
        };
    },

    async addParticipants(conversationId: string, participantIds: string[]) {
        const response = await BaseService.authenticatedRequest<any>(
            'put',
            `${ApiEndpoints.API_CONVERSATION}/add-participants/${conversationId}`,
            { participantIds }
        );

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const updatedConversation = mapApiConversationToModel(response.data);

        return {
            success: true,
            conversation: updatedConversation,
            message: response.message
        };
    },

    async removeParticipants(conversationId: string, participantIds: string[]) {
        const response = await BaseService.authenticatedRequest<any>(
            'put',
            `${ApiEndpoints.API_CONVERSATION}/remove-participants/${conversationId}`,
            { participantIds }
        );

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const updatedConversation = mapApiConversationToModel(response.data);

        return {
            success: true,
            conversation: updatedConversation,
            message: response.message
        };
    },

    async transferAdmin(conversationId: string, newAdminId: string) {
        const response = await BaseService.authenticatedRequest<any>(
            'put',
            `${ApiEndpoints.API_CONVERSATION}/transfer-admin/${conversationId}`,
            { toUserId: newAdminId }
        );

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const updatedConversation = mapApiConversationToModel(response.data);

        return {
            success: true,
            conversation: updatedConversation,
            message: response.message
        };
    },

    async grantModRole(conversationId: string, userId: string) {
        const response = await BaseService.authenticatedRequest<any>(
            'put',
            `${ApiEndpoints.API_CONVERSATION}/grant-mod-role/${conversationId}`,
            { toUserId: userId }
        );

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const updatedConversation = mapApiConversationToModel(response.data);

        return {
            success: true,
            conversation: updatedConversation,
            message: response.message
        };
    },

    async updateAllowMessaging(conversationId: string) {
        const response = await BaseService.authenticatedRequest<any>(
            'put',
            `${ApiEndpoints.API_CONVERSATION}/update-allow-messaging/${conversationId}`,
            {}
        );

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const updatedConversation = mapApiConversationToModel(response.data);

        return {
            success: true,
            conversation: updatedConversation,
            message: response.message
        };
    },

    async pinMessage(conversationId: string, messageId: string) {
        const response = await BaseService.authenticatedRequest<any>(
            'put',
            `${ApiEndpoints.API_CONVERSATION}/pin-message/${conversationId}`,
            { messageId }
        );

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const updatedConversation = mapApiConversationToModel(response.data);

        return {
            success: true,
            conversation: updatedConversation,
            message: response.message
        };
    },

    async joinGroupByUrl(url: string) {
        const response = await BaseService.authenticatedRequest<any>(
            'put',
            `${ApiEndpoints.API_CONVERSATION}/join-group-by-url`,
            { url }
        );

        if (!response.success || !response.data) {
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.message
            };
        }

        const conversation = mapApiConversationToModel(response.data);

        return {
            success: true,
            conversation,
            message: response.message
        };
    }
};

function mapApiConversationToModel(apiConv: any): Conversation {
    return {
        id: apiConv.id,
        isGroup: apiConv.isGroup || false,
        name: apiConv.name || '',
        avatarUrl: apiConv.avatarUrl || apiConv.avatar || '',
        avatarGroup: apiConv.avatarGroup || '',
        type: apiConv.isGroup ? 'group' : '1vs1',
        participantIds: apiConv.participantIds || [],
        participantInfo: apiConv.participantInfo || [],
        url: apiConv.url || '',
        pinMessages: apiConv.pinMessages || [],
        settings: {
            isReviewNewParticipant: apiConv.settings?.isReviewNewParticipant || false,
            isAllowReadNewMessage: apiConv.settings?.isAllowReadNewMessage || true,
            isAllowMessaging: apiConv.settings?.isAllowMessaging || true,
            pendingList: apiConv.settings?.pendingList || []
        },
        lastMessage: apiConv.lastMessage || null,
        createdAt: apiConv.createdAt || new Date(),
        updatedAt: apiConv.updatedAt || new Date()
    };
}