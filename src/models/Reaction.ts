// id: { type: String, default: generateIdSnowflake, unique: true },
// messageId: { type: String, required: true },
// userId: { type: String, required: true },
// emoji: { type: String, required: true },

export interface Reaction {
    id?: string;
    messageId: string;
    userId: string;
    emoji: string;
    createdAt?: Date;
    updatedAt?: Date;
}
