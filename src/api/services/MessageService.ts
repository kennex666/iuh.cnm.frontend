import axios from "axios";
import { Message, MessageType } from "@/src/models/Message";
import { ApiEndpoints } from "@/src/constants/ApiConstant";
import { AuthStorage } from "@/src/services/AuthStorage";

interface MessageService {
    getMessages: (conversationId: string) => Promise<{
        success: boolean;
        messages: Message[];
        statusMessage: string;
    }>;
    sendMessage: (message: Partial<Message>) => Promise<{
        success: boolean;
        message: Message;
        statusMessage: string;
    }>;
    updateMessage: (messageId: string, content: string) => Promise<{
        success: boolean;
        message: Message;
        statusMessage: string;
    }>;
    deleteMessage: (messageId: string) => Promise<{
        success: boolean;
        statusMessage: string;
    }>;
}

export const MessageService: MessageService = {
    async getMessages(conversationId: string) {
        try {
            console.log("conversationId", conversationId);
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    messages: [],
                    statusMessage: "No token found"
                };
            }

            const url = `http://localhost:8087/api/api/messages`;
            console.log("url", url);
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === '200') {
                const messages = response.data.data.map((msg: any) => ({
                    id: msg._id || msg.id,
                    conversationId: msg.conversationId,
                    senderId: msg.senderId,
                    content: msg.content,
                    type: msg.type,
                    repliedToId: msg.repliedToId,
                    sentAt: msg.sentAt,
                    readBy: msg.readBy || []
                }));

                return {
                    success: true,
                    messages,
                    statusMessage: response.data.message || "Successfully fetched messages"
                };
            }

            return {
                success: false,
                messages: [],
                statusMessage: response.data.message || "Failed to fetch messages"
            };
        } catch (error: any) {
            console.error("Get messages error:", error);
            return {
                success: false,
                messages: [],
                statusMessage: error.response?.data?.message || error.message || "Failed to get messages"
            };
        }
    },

    async sendMessage(message: Partial<Message>) {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                throw new Error("No token found");
            }

            const url = ApiEndpoints.API_MESSAGE;

            const response = await axios.post(url, message, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === '200') {
                const msg = response.data.data;
                return {
                    success: true,
                    message: {
                        id: msg._id || msg.id,
                        conversationId: msg.conversationId,
                        senderId: msg.senderId,
                        content: msg.content,
                        type: msg.type,
                        repliedToId: msg.repliedToId,
                        sentAt: msg.sentAt,
                        readBy: msg.readBy || []
                    },
                    statusMessage: response.data.message || "Message sent successfully"
                };
            }

            throw new Error(response.data.message || "Failed to send message");
        } catch (error: any) {
            console.error("Send message error:", error);
            throw error;
        }
    },

    async updateMessage(messageId: string, content: string) {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                throw new Error("No token found");
            }

            const url = `${ApiEndpoints.API_MESSAGE}/${messageId}`;

            const response = await axios.put(url, 
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.status === '200') {
                const msg = response.data.data;
                return {
                    success: true,
                    message: {
                        id: msg._id || msg.id,
                        conversationId: msg.conversationId,
                        senderId: msg.senderId,
                        content: msg.content,
                        type: msg.type,
                        repliedToId: msg.repliedToId,
                        sentAt: msg.sentAt,
                        readBy: msg.readBy || []
                    },
                    statusMessage: response.data.message || "Message updated successfully"
                };
            }

            throw new Error(response.data.message || "Failed to update message");
        } catch (error: any) {
            console.error("Update message error:", error);
            throw error;
        }
    },

    async deleteMessage(messageId: string) {
        try {
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                throw new Error("No token found");
            }

            const url = `${ApiEndpoints.API_MESSAGE}/${messageId}`;

            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === '200') {
                return {
                    success: true,
                    statusMessage: response.data.message || "Message deleted successfully"
                };
            }

            throw new Error(response.data.message || "Failed to delete message");
        } catch (error: any) {
            console.error("Delete message error:", error);
            throw error;
        }
    }
};
