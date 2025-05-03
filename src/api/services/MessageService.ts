import { ApiEndpoints } from "@/src/constants/ApiConstant";
import { Message } from "@/src/models/Message";
import { BaseService } from "@/src/api/services/BaseService";

export interface MessageService {
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
	makeACall: (conversationId: string) => Promise<{
		success: boolean;
		messages: Message[];
		statusMessage: string;
	}>;
	rejectCall: (conversationId: string) => Promise<{
		success: boolean;
		messages: Message[];
		statusMessage: string;
	}>;
}

export const MessageService: MessageService = {
	async getMessages(conversationId: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				'get',
				`${ApiEndpoints.API_MESSAGE}/conversation/${conversationId}`
			);

			if (!response.success) {
				return {
					success: false,
					messages: [],
					isNewer: false,
					statusMessage: response.message
				};
			}

			if (!response.data) {
				return {
					success: true,
					messages: [],
					isNewer: true,
					statusMessage: response.message || "Hãy làm quen với người dùng này"
				};
			}

			const messages = response.data.map(mapApiMessageToModel);

			return {
				success: true,
				messages,
				isNewer: false,
				statusMessage: response.message || "Successfully fetched messages"
			};
		} catch (error: any) {
			console.error("Error fetching messages:", error);
			return {
				success: false,
				messages: [],
				isNewer: false,
				statusMessage: error.message || "Failed to fetch messages"
			};
		}
	},

	async sendMessage(message: Partial<Message>) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				'post',
				ApiEndpoints.API_MESSAGE,
				message
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					message: {} as Message,
					statusMessage: response.message || "Failed to send message"
				};
			}

			const sentMessage = mapApiMessageToModel(response.data);

			return {
				success: true,
				message: sentMessage,
				statusMessage: response.message || "Message sent successfully"
			};
		} catch (error: any) {
			console.error("Error sending message:", error);
			return {
				success: false,
				message: {} as Message,
				statusMessage: error.message || "Failed to send message"
			};
		}
	},

	async updateMessage(messageId: string, content: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				'put',
				`${ApiEndpoints.API_MESSAGE}/${messageId}`,
				{ content }
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					message: {} as Message,
					statusMessage: response.message || "Failed to update message"
				};
			}

			const updatedMessage = mapApiMessageToModel(response.data);

			return {
				success: true,
				message: updatedMessage,
				statusMessage: response.message || "Message updated successfully"
			};
		} catch (error: any) {
			console.error("Error updating message:", error);
			return {
				success: false,
				message: {} as Message,
				statusMessage: error.message || "Failed to update message"
			};
		}
	},

	async deleteMessage(messageId: string) {
		try {
			const response = await BaseService.authenticatedRequest<void>(
				'delete',
				`${ApiEndpoints.API_MESSAGE}/${messageId}`
			);

			return {
				success: response.success,
				statusMessage: response.message || (response.success ?
					"Message deleted successfully" : "Failed to delete message")
			};
		} catch (error: any) {
			console.error("Error deleting message:", error);
			return {
				success: false,
				statusMessage: error.message || "Failed to delete message"
			};
		}
	},

	async makeACall(conversationId: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				'get',
				`${ApiEndpoints.API_WEBRTC}/create-call/${conversationId}`
			);

			return {
				success: response.success,
				messages: response.data || [],
				statusMessage: response.message || "Call operation completed"
			};
		} catch (error: any) {
			console.error("Error making call:", error);
			return {
				success: false,
				messages: [],
				statusMessage: error.message || "Failed to make call"
			};
		}
	},

	async rejectCall(conversationId: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				'get',
				`${ApiEndpoints.API_WEBRTC}/end-call/${conversationId}`
			);

			return {
				success: response.success,
				messages: response.data || [],
				statusMessage: response.message || "Call operation completed"
			};
		} catch (error: any) {
			console.error("Error rejecting call:", error);
			return {
				success: false,
				messages: [],
				statusMessage: error.message || "Failed to reject call"
			};
		}
	}
};

function mapApiMessageToModel(msg: any): Message {
	return {
		id: msg.id || msg._id,
		conversationId: msg.conversationId,
		senderId: msg.senderId,
		content: msg.content,
		type: msg.type,
		repliedToId: msg.repliedToId || msg.repliedTold,
		sentAt: msg.sentAt,
		readBy: msg.readBy || []
	};
}