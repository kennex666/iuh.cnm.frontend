export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    type: string;
    repliedToId: string | null;
    sentAt: string;
    readBy: string[];
}
