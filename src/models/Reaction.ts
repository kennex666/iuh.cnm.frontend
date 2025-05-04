export interface Reaction {
    id?: string;
    messageId: string;
    userId: string;
    emoji: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
