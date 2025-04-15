import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { ApiEndpoints } from '@/src/constants/ApiConstant';
import { Message } from '@/src/models/Message';
import { Conversation } from '@/src/models/Conversation';

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private messageCallbacks: ((message: Message) => void)[] = [];
    private conversationCallbacks: ((conversation: Conversation) => void)[] = [];
    private friendRequestCallbacks: ((userId: string) => void)[] = [];
    private onlineStatusCallbacks: ((userId: string, isOnline: boolean) => void)[] = [];
    private currentRooms: Set<string> = new Set();
    private loginCallbacks: ((userId: string) => void)[] = [];

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
            // Rejoin all rooms after reconnection
            this.currentRooms.forEach(room => {
                this.joinRoom(room);
            });
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        this.socket.on('login', ({ userId }) => {
            console.log('Login successful for user:', userId);
            this.loginCallbacks.forEach(callback => callback(userId));
        });

        this.socket.on('new_message', (message: Message) => {
            console.log('Received new message:', message);
            this.messageCallbacks.forEach(callback => callback(message));
        });

        this.socket.on('new_conversation', (conversation: Conversation) => {
            this.conversationCallbacks.forEach(callback => callback(conversation));
        });

        this.socket.on('friend_request', (userId: string) => {
            this.friendRequestCallbacks.forEach(callback => callback(userId));
        });

        this.socket.on('user_online', (userId: string) => {
            this.onlineStatusCallbacks.forEach(callback => callback(userId, true));
        });

        this.socket.on('user_offline', (userId: string) => {
            this.onlineStatusCallbacks.forEach(callback => callback(userId, false));
        });

        this.socket.on('pong', (message: string) => {
            console.log('Pong received: ', message);
        });

        this.socket.on('error', (error: { message: string }) => {
            console.error('Socket error:', error.message);
        });
    }

    public joinRoom(roomId: string): void {
        if (this.socket) {
            console.log('Joining room:', roomId);
            this.socket.emit('join_room', roomId);
            this.currentRooms.add(roomId);
        }
    }

    public leaveRoom(roomId: string): void {
        if (this.socket) {
            console.log('Leaving room:', roomId);
            this.socket.emit('leave_room', roomId);
            this.currentRooms.delete(roomId);
        }
    }

    public disconnect(): void {
        if (this.socket) {
            console.log('Disconnecting socket');
            this.socket.disconnect();
            this.socket = null;
            this.currentRooms.clear();
        }
    }

    public ping(): void {
        if (this.socket) {
            this.socket.emit('ping');
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

    public onNewConversation(callback: (conversation: Conversation) => void): void {
        this.conversationCallbacks.push(callback);
    }

    public onFriendRequest(callback: (userId: string) => void): void {
        this.friendRequestCallbacks.push(callback);
    }

    public onUserStatusChange(callback: (userId: string, isOnline: boolean) => void): void {
        this.onlineStatusCallbacks.push(callback);
    }

    public onLogin(callback: (userId: string) => void): void {
        this.loginCallbacks.push(callback);
    }

    public removeMessageListener(callback: (message: Message) => void): void {
        this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    }

    public removeConversationListener(callback: (conversation: Conversation) => void): void {
        this.conversationCallbacks = this.conversationCallbacks.filter(cb => cb !== callback);
    }

    public removeFriendRequestListener(callback: (userId: string) => void): void {
        this.friendRequestCallbacks = this.friendRequestCallbacks.filter(cb => cb !== callback);
    }

    public removeUserStatusListener(callback: (userId: string, isOnline: boolean) => void): void {
        this.onlineStatusCallbacks = this.onlineStatusCallbacks.filter(cb => cb !== callback);
    }

    public removeLoginListener(callback: (userId: string) => void): void {
        this.loginCallbacks = this.loginCallbacks.filter(cb => cb !== callback);
    }
}

export default SocketService;