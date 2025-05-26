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
    
    // Tìm tin nhắn gốc dựa trên cả repliedToId và repliedTold
    const repliedMessage = messages.find(m => 
        m.id === messageId || 
        m.repliedToId === messageId || 
        m.repliedTold === messageId
    );
    
    if (!repliedMessage) {
        console.warn(`Replied message with id ${messageId} not found`);
        return null;
    }
    
    return repliedMessage;
};