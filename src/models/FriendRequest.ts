export interface FriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: 'pending' | 'accepted' | 'declined';
    createAt: Date | string;
    updateAt: Date | string;
}
