// id: { type: String, default: generateIdSnowflake, unique: true },
// messageId: { type: String, required: true },
// userId: { type: String, required: true },
// emoji: { type: String, required: true },

interface Reaction {
    id: string;
    messageId: string;
    userId: string;
    emoji: string;
}

export default Reaction;
