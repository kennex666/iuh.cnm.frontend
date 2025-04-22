import {Message} from '@/src/models/Message';

export interface Conversation {
    id?: string;
    isGroup: boolean;
    name: string;
    avatar: string;
    participants: string[];
    adminIds: string[];
    settings: Record<string, any>;
    lastMessage?: Message | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}
