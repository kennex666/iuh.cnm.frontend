// Định nghĩa enum cho các loại tin nhắn
export enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    FILE = "file",
    AUDIO = "audio",
    VIDEO = "video",
    CALL = "call",
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    type: MessageType;
    repliedToId: string;
    repliedTold?: string;  // Optional vì có default value trong schema
    sentAt: Date | string;
    readBy: string[];
}
