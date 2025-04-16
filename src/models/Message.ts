// Định nghĩa enum cho các loại tin nhắn
export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    FILE = 'file',
    REACTION = 'reaction'
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    type: MessageType;
    repliedToId?: string;  // Optional vì có default value trong schema
    sentAt: Date | string;
    readBy: string[];
}
