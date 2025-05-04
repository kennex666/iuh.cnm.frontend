import {Message} from '@/src/models/Message';

export const formatMessageTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatMessageDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export const formatFullDateTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export const findRepliedMessage = (
    messageId: string | undefined | null,
    messages: Message[]
): Message | null => {
    if (!messageId) return null;
    return messages.find(m => m.id === messageId) || null;
};