import {Message} from '@/src/models/Message';

export interface ParticipantInfo {
    id: string;
    name: string;
    avatar?: string;
    nickname?: string;
    role: 'member' | 'admin' | 'mod';
}

export interface PendingUser {
    id: string;
    name?: string;
    avatar?: string;
    requestedAt?: Date | string;
}

export interface Settings {
    isReviewNewParticipant: boolean;
    isAllowReadNewMessage: boolean;
    isAllowMessaging: boolean;
    pendingList: PendingUser[];
}

export interface Conversation {
    id: string;
    isGroup: boolean;
    name: string;
    avatarUrl?: string;
    avatarGroup?: string;
    type: '1vs1' | 'group';
    participantIds: string[];
    participantInfo: ParticipantInfo[];
    url: string;
    pinMessages: Message[];
    settings: Settings;
    lastMessage?: Message | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}
