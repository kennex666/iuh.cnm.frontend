import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { ApiEndpoints } from '@/src/constants/ApiConstant';
import { Message } from '@/src/models/Message';
import { Conversation } from '@/src/models/Conversation';
import FriendRequest from '@/src/models/FriendRequest';

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private messageCallbacks: ((message: Message) => void)[] = [];
    private conversationCallbacks: ((conversation: Conversation) => void)[] = [];
    private friendRequestCallbacks: ((friendRequest: FriendRequest) => void)[] = [];
    private friendRequestActionCallbacks: ((requestId: string) => void)[] = [];

    private constructor() {}

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public connect(token: string): void {
        if (this.socket) {
            this.disconnect();
        }

        this.socket = io(ApiEndpoints.SOCKET_URL, {
            auth: {
                token: token
            },
            transports: ['websocket']
        });

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('new_message', (message: Message) => {
            this.messageCallbacks.forEach(callback => callback(message));
        });

        this.socket.on('new_conversation', (conversation: Conversation) => {
            this.conversationCallbacks.forEach(callback => callback(conversation));
        });

        this.socket.on('friend_request', (friendRequest: FriendRequest) => {
            this.friendRequestCallbacks.forEach(callback => callback(friendRequest));
        });

        this.socket.on('friend_request', (requestId: string) => {
            this.friendRequestActionCallbacks.forEach(callback => callback(requestId));
        });

        this.socket.on('pong', (message: string) => {
            console.log('Pong received: ', message);
        });

        this.socket.on('error', (error: { message: string }) => {
            console.error('Socket error:', error.message);
        });
    }

    public disconnect(): void {
        if (this.socket) {
            console.log('Disconnecting socket');
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public ping(): void {
        if (this.socket) {
            this.socket.emit('ping');
        }
    }

    public joinConversation(conversationId: string): void {
        if (this.socket) {
            this.socket.emit('join_conversation', conversationId);
        }
    }
    
    public leaveConversation(conversationId: string): void {
        if (this.socket) {
            this.socket.emit('leave_conversation', conversationId);
        }
    }

    public sendMessage(message: Message): void {
        if (this.socket) {
            console.log('Sending message to socket is: ', message);
            this.socket.emit('send_message', message);
        }
    }
    
    public onNewMessage(callback: (message: Message) => void): void {
        this.messageCallbacks.push(callback);
    }

    public sendFriendRequest(friendRequest: any): void {
        if (this.socket) {
            this.socket.emit('send_friend_request', friendRequest);
        }
    }

    public onFriendRequest(callback: (friendRequest: FriendRequest) => void): void {
        this.friendRequestCallbacks.push(callback);
    }

    public onFriendRequestAction(callback: (requestId: string) => void): void {
        this.friendRequestActionCallbacks.push(callback);
    }

    public onNewConversation(callback: (conversation: Conversation) => void): void {
        this.conversationCallbacks.push(callback);
    }

    public removeMessageListener(callback: (message: Message) => void): void {
        this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    }

    public removeConversationListener(callback: (conversation: Conversation) => void): void {
        this.conversationCallbacks = this.conversationCallbacks.filter(cb => cb !== callback);
    }

    public removeFriendRequestListener(callback: (friendRequest: FriendRequest) => void): void {
        this.friendRequestCallbacks = this.friendRequestCallbacks.filter(cb => cb !== callback);
    }
    
}

export default SocketService;