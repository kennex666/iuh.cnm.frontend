export interface Reaction {
    id?: string;
    messageId: string;
    userId: string;
    emoji: string;
    createdAt?: Date;
    updatedAt?: Date;
}
