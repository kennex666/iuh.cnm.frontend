import axios from "axios";
import { ApiEndpoints } from "@/src/constants/ApiConstant";
import { AuthStorage } from "@/src/storage/AuthStorage";
import { Conversation } from "@/src/models/Conversation";

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
}

export const ConversationService: ConversationService = {
    async getConversations(): Promise<{
        success: boolean;
        conversations: Conversation[];
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            console.log("Token:", token ? "Found" : "Not found");
            
            if (!token) {
                return {
                    success: false,
                    conversations: [],
                    message: "No token found",
                };
            }

            const url = ApiEndpoints.API_CONVERSATION;
            
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                if (!response.data.data) {
                    console.warn("No conversations data found in response");
                    return {
                        success: false,
                        conversations: [],
                        message: "No conversations data found",
                    };
                }
                
                const conversations = response.data.data.map((apiConv: any) => ({
                    id: apiConv.id,
                    isGroup: apiConv.isGroup || false,
                    name: apiConv.name || '',
                    avatarUrl: apiConv.avatarUrl || '',
                    avatarGroup: apiConv.avatarGroup || '',
                    type: apiConv.type || '1vs1',
                    participantIds: apiConv.participantIds || [],
                    participantInfo: apiConv.participantInfo || [],
                    url: apiConv.url || '',
                    pinMessages: apiConv.pinMessages || [],
                    settings: apiConv.settings || {
                        isReviewNewParticipant: false,
                        isAllowReadNewMessage: true,
                        isAllowMessaging: true,
                        pendingList: [],
                    },
                    lastMessage: apiConv.lastMessage || null,
                    createdAt: apiConv.createdAt || new Date(),
                    updatedAt: apiConv.updatedAt || new Date(),
                }));
                
                return { 
                    success: true, 
                    conversations, 
                    message: response.data.message || "Successfully fetched conversations" 
                };
            }
            return { 
                success: false, 
                conversations: [], 
                message: response.data.message || "Failed to fetch conversations"
            };
        } catch (error: any) {
            console.error("Get conversations error:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error headers:", error.response?.headers);
            return {
                success: false,
                conversations: [],
                message: error.response?.data?.message || error.message || "Failed to get conversations",
            };
        }
    },

    async getConversationById(id: string): Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    conversation: {} as Conversation,
                    message: "No token found",
                };
            }

                const response = await axios.get(`${ApiEndpoints.API_CONVERSATION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Response data1212121   :", response.data);
            if (response.data.success) {
                const apiConv = response.data.data._doc;
                const conversation: Conversation = {
                    id: apiConv.id,
                    isGroup: apiConv.isGroup,
                    name: apiConv.name,
                    avatarUrl: apiConv.avatar || '',
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
                    createdAt: apiConv.createdAt,
                    updatedAt: apiConv.updatedAt
                };

                return { 
                    success: true, 
                    conversation, 
                    message: response.data.message || "Successfully fetched conversation" 
                };
            }
            return { 
                success: false, 
                conversation: {} as Conversation, 
                message: response.data.message || "Failed to fetch conversation" 
            };
        } catch (error) {
            console.error("Get conversation error:", error);
            return {
                success: false,
                conversation: {} as Conversation,
                message: "Failed to get conversation",
            };
        }
    },

    async createConversation(conversation: Conversation): Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    conversation: {} as Conversation,
                    message: "No token found",
                };
            }

            const response = await axios.post(`${ApiEndpoints.API_CONVERSATION}`, conversation, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("ada", response);
            if (response.data.success) {
                const apiConv = response.data.data;
                const newConversation: Conversation = {
                    id: apiConv.id,
                    isGroup: apiConv.isGroup,
                    name: apiConv.name,
                    avatarUrl: apiConv.avatarUrl || '',
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
                    createdAt: apiConv.createdAt,
                    updatedAt: apiConv.updatedAt
                };

                return { 
                    success: true, 
                    conversation: newConversation, 
                    message: response.data.message || "Successfully created conversation" 
                };
            }
            return { 
                success: false, 
                conversation: {} as Conversation, 
                message: response.data.message || "Failed to create conversation" 
            };
        } catch (error) {
            console.error("Create conversation error:", error);
            return {
                success: false,
                conversation: {} as Conversation,
                message: "Failed to create conversation",
            };
        }
    },

    async updateConversation(id: string, conversation: Conversation): Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    conversation: {} as Conversation,
                    message: "No token found",
                };
            }

            const response = await axios.put(`${ApiEndpoints.API_CONVERSATION}/${id}`, conversation, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const apiConv = response.data.data;
                const updatedConversation: Conversation = {
                    id: apiConv.id,
                    isGroup: apiConv.isGroup,
                    name: apiConv.name,
                    avatarUrl: apiConv.avatarUrl || '',
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
                    createdAt: apiConv.createdAt,
                    updatedAt: apiConv.updatedAt
                };

                return { 
                    success: true, 
                    conversation: updatedConversation, 
                    message: response.data.message || "Successfully updated conversation" 
                };
            }
            return { 
                success: false, 
                conversation: {} as Conversation, 
                message: response.data.message || "Failed to update conversation" 
            };
        } catch (error) {
            console.error("Update conversation error:", error);
            return {
                success: false,
                conversation: {} as Conversation,
                message: "Failed to update conversation",
            };
        }
    },

    async deleteConversation(id: string): Promise<{
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

            const response = await axios.delete(`${ApiEndpoints.API_CONVERSATION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                return { 
                    success: true, 
                    message: response.data.message || "Successfully deleted conversation" 
                };
            }
            return { 
                success: false, 
                message: response.data.message || "Failed to delete conversation" 
            };
        } catch (error) {
            console.error("Delete conversation error:", error);
            return {
                success: false,
                message: "Failed to delete conversation",
            };
        }
    },

    // Add more methods as needed
    async addParticipants(conversationId: string, participantIds: string[]): Promise<{
        success: boolean;
        conversation: Conversation;
        message: string;
    }> {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    conversation: {} as Conversation,
                    message: "No token found",
                };
            }
    
            console.log("Adding participants:", participantIds);
            console.log("Conversation ID:", conversationId);
            const response = await axios.put(
                `${ApiEndpoints.API_CONVERSATION}/add-participants/${conversationId}`,
                { participantIds },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.data.success) {
                const updatedConversation: Conversation = {
                    id: response.data.data.id,
                    isGroup: response.data.data.isGroup,
                    name: response.data.data.name,
                    avatarUrl: response.data.data.avatarUrl || '',
                    avatarGroup: response.data.data.avatarGroup || '',
                    type: response.data.data.isGroup ? 'group' : '1vs1',
                    participantIds: response.data.data.participantIds || [],
                    participantInfo: response.data.data.participantInfo || [],
                    url: response.data.data.url || '',
                    pinMessages: response.data.data.pinMessages || [],
                    settings: {
                        isReviewNewParticipant: response.data.data.settings?.isReviewNewParticipant || false,
                        isAllowReadNewMessage: response.data.data.settings?.isAllowReadNewMessage || true,
                        isAllowMessaging: response.data.data.settings?.isAllowMessaging || true,
                        pendingList: response.data.data.settings?.pendingList || [],
                    },
                    lastMessage: response.data.data.lastMessage || null,
                    createdAt: response.data.data.createdAt,
                    updatedAt: response.data.data.updatedAt,
                };
    
                return {
                    success: true,
                    conversation: updatedConversation,
                    message: response.data.message || "Successfully added participants",
                };
            }
    
            return {
                success: false,
                conversation: {} as Conversation,
                message: response.data.message || "Failed to add participants",
            };
        } catch (error) {
            console.error("Add participants error:", error);
            return {
                success: false,
                conversation: {} as Conversation,
                message: "Failed to add participants",
            };
        }
    },
};
