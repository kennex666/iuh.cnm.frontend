import axios from "axios";
import { Domains } from "@/src/constants/ApiConstant";
import { AuthStorage } from "@/src/services/AuthStorage";
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

            const url = Domains.API_CONVERSATION;
            
            console.log("Request URL:", url);
            console.log("Request Headers:", {
                Authorization: `Bearer ${token}`,
            });
            
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Response Status:", response.status);
            console.log("Response Data:", response.data);


            if (response.data.status === '200') {
                if (!response.data.data) {
                    return {
                        success: false,
                        conversations: [],
                        message: "No conversations data found",
                    };
                }
                console.log("Response Success:", response.data);
                const conversations = response.data.data.map((apiConv: any) => ({
                    id: apiConv._id,
                    isGroup: apiConv.isGroup || false,
                    name: apiConv.name || '',
                    avatar: apiConv.avatar || '',
                    participants: apiConv.participants || [],
                    adminIds: apiConv.adminIds || [],
                    settings: apiConv.settings || {},
                    lastMessage: apiConv.lastMessage || null,
                    createdAt: apiConv.createdAt || new Date(),
                    updatedAt: apiConv.updatedAt || new Date()
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

            const response = await axios.get(`${Domains.API_CONVERSATION}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const apiConv = response.data.data;
                const conversation: Conversation = {
                    id: apiConv.id,
                    isGroup: apiConv.isGroup,
                    name: apiConv.name,
                    avatar: apiConv.avatar || '',
                    participants: apiConv.participants || [],
                    adminIds: apiConv.adminIds,
                    settings: apiConv.settings,
                    lastMessage: apiConv.lastMessage,
                    createdAt: apiConv.createdAt,
                    updatedAt: apiConv.updatedAt,
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

            const response = await axios.post(`${Domains.API_CONVERSATION}`, conversation, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const apiConv = response.data.data;
                const newConversation: Conversation = {
                    id: apiConv.id,
                    isGroup: apiConv.isGroup,
                    name: apiConv.name,
                    avatar: apiConv.avatar || '',
                    participants: apiConv.participants || [],
                    adminIds: apiConv.adminIds,
                    settings: apiConv.settings,
                    lastMessage: apiConv.lastMessage,
                    createdAt: apiConv.createdAt,
                    updatedAt: apiConv.updatedAt,
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

            const response = await axios.put(`${Domains.API_CONVERSATION}/${id}`, conversation, {
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
                    avatar: apiConv.avatar || '',
                    participants: apiConv.participants || [],
                    adminIds: apiConv.adminIds,
                    settings: apiConv.settings,
                    lastMessage: apiConv.lastMessage,
                    createdAt: apiConv.createdAt,
                    updatedAt: apiConv.updatedAt,
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

            const response = await axios.delete(`${Domains.API_CONVERSATION}/${id}`, {
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
    }
};
