import axios from "axios";
import { Message, MessageType } from "@/src/models/Message";
import { ApiEndpoints } from "@/src/constants/ApiConstant";
import { AuthStorage } from "@/src/services/AuthStorage";
import { useAuth } from "@/src/contexts/UserContext";

interface MessageService {
    getMessages: (conversationId: string) => Promise<{
        success: boolean;
        messages: Message[];
        isNewer: boolean;
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
            const token = await AuthStorage.getAccessToken();
            if (!token) {
                return {
                    success: false,
                    messages: [],
                    isNewer: false,
                    statusMessage: "No token found"
                };
            }

            const url = `${ApiEndpoints.API_MESSAGE}/conversation/${conversationId}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.data.data == null) {
                return {
                    success: true,
                    messages: [],
                    isNewer: true,
                    statusMessage: response.data.message || "Hãy làm quen với người dùng này"
                };
            }
            console.log("response of get messages: ", response.data);
            if (response.data.success) {
                const messages = response.data.data.map((msg: Message) => ({
                    id: msg.id,
                    conversationId: msg.conversationId,
                    senderId: msg.senderId,
                    content: msg.content,
                    type: msg.type,
                    repliedToId: msg.repliedTold,
                    sentAt: msg.sentAt,
                    readBy: msg.readBy || []
                }));

                console.log("messages of conversation: ", messages);

                return {
                    success: true,
                    messages,
                    isNewer: false,
                    statusMessage: response.data.message || "Successfully fetched messages"
                };
            }

            return {
                success: false,
                messages: [],
                isNewer: false,
                statusMessage: response.data.message || "Failed to fetch messages"
            };
        } catch (error: any) {
            console.error("Get messages error:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error headers:", error.response?.headers);
            return {
                success: false,
                messages: [],
                isNewer: false,
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

            if (response.data.success) {
                const msg = response.data.data;
                return {
                    success: true,
                    message: {
                        id: msg.id || msg._id,
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

            const url = `http://localhost:8087/api/messages/${messageId}`;

            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('response delete message: ', response);

            if (response.data.success || response.data.status === '200' || response.status === 200) {
                return {
                    success: true,
                    statusMessage: response.data.message || "Message deleted successfully"
                };
            }

            return {
                success: false,
                statusMessage: response.data.message || "Failed to delete message"
            };
        } catch (error: any) {
            console.error("Delete message error:", error);
            return {
                success: false,
                statusMessage: error.response?.data?.message || error.message || "Failed to delete message"
            };
        }
    }
};
