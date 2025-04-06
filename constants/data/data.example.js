// Sample data for the chat application
export const users = [
  {
    id: "u1",
    name: "Lê Nguyên Duy Khang",
    email: "khang.le@example.com",
    phone: "0123456789",
    gender: "male",
    password: "hashedPassword123",
    avatarUrl: "https://placehold.co/400x400/0068FF/FFFFFF/png?text=LK",
    coverUrl: "https://placehold.co/1200x400/0068FF/FFFFFF/png?text=Cover",
    dob: new Date("1995-05-15"),
    isOnline: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-15")
  },
  {
    id: "u2",
    name: "Nguyễn Thị Bảo Trân",
    email: "tran.nguyen@example.com",
    phone: "0987654321",
    gender: "female",
    password: "hashedPassword456",
    avatarUrl: "https://placehold.co/400x400/FF1493/FFFFFF/png?text=BT",
    coverUrl: "https://placehold.co/1200x400/FF1493/FFFFFF/png?text=Cover",
    dob: new Date("1998-08-20"),
    isOnline: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-10")
  },
  {
    id: "u3",
    name: "Trần Văn An",
    email: "an.tran@example.com",
    phone: "0369852147",
    gender: "male",
    password: "hashedPassword789",
    avatarUrl: "https://placehold.co/400x400/32CD32/FFFFFF/png?text=TA",
    coverUrl: "https://placehold.co/1200x400/32CD32/FFFFFF/png?text=Cover",
    dob: new Date("1997-03-25"),
    isOnline: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-15")
  }
];

export const friendRequests = [
  {
    id: "fr1",
    senderId: "u1",
    receiverId: "u2",
    status: "pending",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10")
  },
  {
    id: "fr2",
    senderId: "u3",
    receiverId: "u1",
    status: "accepted",
    createdAt: new Date("2024-03-08"),
    updatedAt: new Date("2024-03-09")
  }
];

export const conversations = [
  {
    id: "c1",
    isGroup: false,
    name: null,
    avatarUrl: null,
    participantIds: ["u1", "u2"],
    adminIds: [],
    settings: {},
    lastMessage: {
      id: "m1",
      conversationId: "c1",
      senderId: "u1",
      content: "Hello! How are you?",
      type: "text",
      repliedToId: null,
      sentAt: new Date("2024-03-15T10:30:00"),
      readBy: ["u1", "u2"]
    },
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-15")
  },
  {
    id: "c2",
    isGroup: true,
    name: "420300154902_17B_HK2_20242025",
    avatarUrl: "https://placehold.co/400x400/0068FF/FFFFFF/png?text=G",
    participantIds: ["u1", "u2", "u3"],
    adminIds: ["u1"],
    settings: {
      notifications: true,
      theme: "default"
    },
    lastMessage: {
      id: "m1",
      conversationId: "c1",
      senderId: "u1",
      content: "Hello! How are you?",
      type: "text",
      repliedToId: null,
      sentAt: new Date("2024-03-15T10:30:00"),
      readBy: ["u1", "u2"]
    },
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-03-15")
  }
];

export const messages = [
  {
    id: "m1",
    conversationId: "c1",
    senderId: "u1",
    content: "Hello! How are you?",
    type: "text",
    repliedToId: null,
    sentAt: new Date("2024-03-15T10:30:00"),
    readBy: ["u1", "u2"]
  },
  {
    id: "m2",
    conversationId: "c1",
    senderId: "u2",
    content: "I'm good, thanks! 😊",
    type: "text",
    repliedToId: "m1",
    sentAt: new Date("2024-03-15T10:31:00"),
    readBy: ["u1", "u2"]
  },
  {
    id: "m3",
    conversationId: "c2",
    senderId: "u1",
    content: "https://example.com/document.pdf",
    type: "file",
    repliedToId: null,
    sentAt: new Date("2024-03-15T11:00:00"),
    readBy: ["u1", "u2", "u3"]
  }
];

export const attachments = [
  {
    id: "a1",
    messageId: "m3",
    url: "https://example.com/document.pdf",
    fileType: "application/pdf",
    fileName: "document.pdf",
    size: 1024576 // 1MB
  }
];

export const reactions = [
  {
    id: "r1",
    messageId: "m2",
    userId: "u1",
    emoji: "❤️"
  },
  {
    id: "r2",
    messageId: "m2",
    userId: "u3",
    emoji: "👍"
  }
];

// Helper function to get all users
export const getAllUsers = () => {
  return users;
};

// Helper function to get user by ID
export const getUserById = (userId) => {
  return users.find(user => user.id === userId);
};

// Helper function to get conversation by ID
export const getConversationById = (conversationId) => {
  return conversations.find(conv => conv.id === conversationId);
};

// Helper function to get messages for a conversation
export const getMessagesByConversationId = (conversationId) => {
  return messages.filter(msg => msg.conversationId === conversationId);
};

// Helper function to get attachments for a message
export const getAttachmentsByMessageId = (messageId) => {
  return attachments.filter(att => att.messageId === messageId);
};

// Helper function to get reactions for a message
export const getReactionsByMessageId = (messageId) => {
  return reactions.filter(react => react.messageId === messageId);
}; 