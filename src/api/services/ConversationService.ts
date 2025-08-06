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
	updateConversation: (
		id: string,
		conversation: Conversation
	) => Promise<{
		success: boolean;
		conversation: Conversation;
		message: string;
	}>;
	deleteConversation: (id: string) => Promise<{
		success: boolean;
		message: string;
	}>;
	leftConversation: (id: string) => Promise<{
		success: boolean;
		message: string;
	}>;
	addParticipants: (
		conversationId: string,
		participantIds: string[]
	) => Promise<{
		success: boolean;
		conversation: Conversation;
		message: string;
	}>;
	removeParticipants: (
		conversationId: string,
		participantIds: string[]
	) => Promise<{
		success: boolean;
		conversation: Conversation;
		message: string;
	}>;
	removeModRole: (
		conversationId: string,
		userId: string
	) => Promise<{
		success: boolean;
		conversation: Conversation;
		message: string;
	}>;
	transferAdmin: (
		conversationId: string,
		newAdminId: string
	) => Promise<{
		success: boolean;
		conversation: Conversation;
		message: string;
	}>;
	grantModRole: (
		conversationId: string,
		userId: string
	) => Promise<{
		success: boolean;
		conversation: Conversation;
		message: string;
	}>;
	updateAllowMessaging: (conversationId: string) => Promise<{
		success: boolean;
		conversation: Conversation;
		message: string;
	}>;
	pinMessage: (
		conversationId: string,
		messageId: string
	) => Promise<{
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
		try {
			const response = await BaseService.authenticatedRequest<any[]>(
				"get",
				ApiEndpoints.API_CONVERSATION
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversations: [],
					message: response.message,
				};
			}

			const conversations = response.data.map(mapApiConversationToModel);

			return {
				success: true,
				conversations,
				message: response.message,
			};
		} catch (error: any) {
			console.error("Error fetching conversations:", error);
			return {
				success: false,
				conversations: [],
				message: error.message || "Failed to fetch conversations",
			};
		}
	},

	async getConversationById(id: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"get",
				`${ApiEndpoints.API_CONVERSATION}/${id}`
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const apiConv = response.data._doc || response.data;
			const conversation = mapApiConversationToModel(apiConv);

			return {
				success: true,
				conversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error(`Error fetching conversation ${id}:`, error);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to fetch conversation",
			};
		}
	},

	async createConversation(conversation: Conversation) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"post",
				ApiEndpoints.API_CONVERSATION,
				conversation
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const newConversation = mapApiConversationToModel(response.data);

			return {
				success: true,
				conversation: newConversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error("Error creating conversation:", error);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to create conversation",
			};
		}
	},

	async updateConversation(id: string, conversation: Conversation) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"put",
				`${ApiEndpoints.API_CONVERSATION}/${id}`,
				conversation
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const updatedConversation = mapApiConversationToModel(
				response.data
			);

			return {
				success: true,
				conversation: updatedConversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error(`Error updating conversation ${id}:`, error);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to update conversation",
			};
		}
	},

	async deleteConversation(id: string) {
		try {
			const response = await BaseService.authenticatedRequest<void>(
				"delete",
				`${ApiEndpoints.API_CONVERSATION}/${id}`
			);

			return {
				success: response.success,
				message: response.message,
			};
		} catch (error: any) {
			console.error(`Error deleting conversation ${id}:`, error);
			return {
				success: false,
				message: error.message || "Failed to delete conversation",
			};
		}
	},

	async leftConversation(id: string) {
		try {
			const response = await BaseService.authenticatedRequest<void>(
				"get",
				`${ApiEndpoints.API_CONVERSATION}/left/${id}`
			);

			return {
				success: response.success,
				message: response.message,
			};
		} catch (error: any) {
			console.error(`Error deleting conversation ${id}:`, error);
			return {
				success: false,
				message: error.message || "Failed to delete conversation",
			};
		}
	},

	async addParticipants(conversationId: string, participantIds: string[]) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"put",
				`${ApiEndpoints.API_CONVERSATION}/add-participants/${conversationId}`,
				{ participantIds }
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const updatedConversation = mapApiConversationToModel(
				response.data
			);

			return {
				success: true,
				conversation: updatedConversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error(
				`Error adding participants to conversation ${conversationId}:`,
				error
			);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to add participants",
			};
		}
	},

	async removeParticipants(conversationId: string, participantIds: string[]) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"put",
				`${ApiEndpoints.API_CONVERSATION}/remove-participants/${conversationId}`,
				{ participantIds }
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const updatedConversation = mapApiConversationToModel(
				response.data
			);

			return {
				success: true,
				conversation: updatedConversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error(
				`Error removing participants from conversation ${conversationId}:`,
				error
			);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to remove participants",
			};
		}
	},

	async removeModRole(conversationId: string, userId: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"put",
				`${ApiEndpoints.API_CONVERSATION}/remove-mod-role/${conversationId}`,
				{ toUserId: userId }
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const updatedConversation = mapApiConversationToModel(
				response.data
			);

			return {
				success: true,
				conversation: updatedConversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error(
				`Error removing mod role in conversation ${conversationId}:`,
				error
			);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to remove mod role",
			};
		}
	},

	async transferAdmin(conversationId: string, newAdminId: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"put",
				`${ApiEndpoints.API_CONVERSATION}/transfer-admin/${conversationId}`,
				{ toUserId: newAdminId }
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const updatedConversation = mapApiConversationToModel(
				response.data
			);

			return {
				success: true,
				conversation: updatedConversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error(
				`Error transferring admin role in conversation ${conversationId}:`,
				error
			);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to transfer admin role",
			};
		}
	},

	async grantModRole(conversationId: string, userId: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"put",
				`${ApiEndpoints.API_CONVERSATION}/grant-mod-role/${conversationId}`,
				{ toUserId: userId }
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const updatedConversation = mapApiConversationToModel(
				response.data
			);

			return {
				success: true,
				conversation: updatedConversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error(
				`Error granting mod role in conversation ${conversationId}:`,
				error
			);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to grant mod role",
			};
		}
	},

	async updateAllowMessaging(conversationId: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"put",
				`${ApiEndpoints.API_CONVERSATION}/update-allow-messaging/${conversationId}`,
				{}
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const updatedConversation = mapApiConversationToModel(
				response.data
			);

			return {
				success: true,
				conversation: updatedConversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error(
				`Error updating messaging permission in conversation ${conversationId}:`,
				error
			);
			return {
				success: false,
				conversation: {} as Conversation,
				message:
					error.message || "Failed to update messaging permission",
			};
		}
	},

	async pinMessage(conversationId: string, messageId: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"put",
				`${ApiEndpoints.API_CONVERSATION}/pin-message/${conversationId}`,
				{ messageId }
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const updatedConversation = mapApiConversationToModel(
				response.data
			);

			return {
				success: true,
				conversation: updatedConversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error(
				`Error pinning message in conversation ${conversationId}:`,
				error
			);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to pin message",
			};
		}
	},

	async joinGroupByUrl(url: string) {
		try {
			const response = await BaseService.authenticatedRequest<any>(
				"put",
				`${ApiEndpoints.API_CONVERSATION}/join-group-by-url`,
				{ url }
			);

			if (!response.success || !response.data) {
				return {
					success: false,
					conversation: {} as Conversation,
					message: response.message,
				};
			}

			const conversation = mapApiConversationToModel(response.data);

			return {
				success: true,
				conversation,
				message: response.message,
			};
		} catch (error: any) {
			console.error("Error joining group by URL:", error);
			return {
				success: false,
				conversation: {} as Conversation,
				message: error.message || "Failed to join group",
			};
		}
	},
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