export enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    FILE = "file",
    AUDIO = "audio",
    VIDEO = "video",
    CALL = "call",
    POLL = 'poll',
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    type: MessageType;
    repliedToId: string;
    repliedTold?: string;
    sentAt: Date | string;
    readBy: string[];
}
