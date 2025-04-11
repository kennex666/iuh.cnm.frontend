import {Message} from '@/src/models/Message';

export interface Conversation {
    id: string;
    isGroup: boolean;
    name: string | null;
    avatarUrl: string | null;
    participantIds: string[];
    adminIds: string[];
    settings: Record<string, any>;
    lastMessage: Message | null;
    createdAt: string;
    updatedAt: string;
}
