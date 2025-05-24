import {io, Socket} from 'socket.io-client';
    import {ApiEndpoints} from '@/src/constants/ApiConstant';
    import {Message} from '@/src/models/Message';
    import {Conversation} from '@/src/models/Conversation';
    import {FriendRequest} from '@/src/models/FriendRequest';

    class SocketService {
        private static instance: SocketService;
        private socket: Socket | null = null;

        // Callback storage
        // Message related
        private messageCallbacks: ((message: Message) => void)[] = [];
        private deleteMessageCallbacks: ((message: Message) => void)[] = [];
        private pinnedMessageCallbacks: ((data: { conversationId: string, pinnedMessages: Message[] }) => void)[] = [];

        // Conversation related
        private conversationCallbacks: ((conversation: Conversation) => void)[] = [];
        private participantsCallbacks: ((updatedConversation: Conversation) => void)[] = [];

        // Friend request related
        private friendRequestCallbacks: ((friendRequest: FriendRequest) => void)[] = [];
        private friendRequestActionCallbacks: ((requestId: string, receiverId: string) => void)[] = [];

        // Attachment related
        private attachmentSentCallbacks: ((data: { success: boolean, messageId: string }) => void)[] = [];
        private attachmentErrorCallbacks: ((error: { message: string }) => void)[] = [];

        // Vote related
        private voteCreatedCallbacks: ((data: { conversationId: string, vote: Message }) => void)[] = [];
        private voteUpdatedCallbacks: ((data: { conversationId: string, vote: Message }) => void)[] = [];
        private voteResultCallbacks: ((data: { conversationId: string, vote: Message }) => void)[] = [];
        private voteErrorCallbacks: ((error: { message: string }) => void)[] = [];

        // QR login related
        private loginQRCallbacks: ((data: { data: { deviceCode: string, socketId: string } }) => void)[] = [];

        private constructor() {}

        public static getInstance(): SocketService {
            if (!SocketService.instance) {
                SocketService.instance = new SocketService();
            }
            return SocketService.instance;
        }

        //==================================
        // Connection management
        //==================================

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

        public connectQR(): void {
            if (this.socket) {
                console.log("Socket already connected for QR");
                return;
            }

            this.socket = io(ApiEndpoints.SOCKET_LOGIN_QR, {
                transports: ['websocket']
            });

            this.setupEventListenersForQR();
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

        //==================================
        // Conversation management
        //==================================

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

        public sendConversation(conversation: Conversation): void {
            if (this.socket) {
                this.socket.emit('conversation:new', conversation);
            }
        }

        public onNewConversation(callback: (conversation: Conversation) => void): void {
            this.conversationCallbacks.push(callback);
        }

        public removeConversationListener(callback: (conversation: Conversation) => void): void {
            this.conversationCallbacks = this.conversationCallbacks.filter(cb => cb !== callback);
        }

        //==================================
        // Participants management
        //==================================

        public actionParticipantsAdded(data: { conversationId: string, participantIds: string[] }): void {
            if (this.socket) {
                console.log('Participants added to conversation:', data.conversationId, data.participantIds);
                this.socket.emit('conversation:add_participants', data);
            }
        }

        public onParticipantsAddedServer(callback: (updatedConversation: Conversation) => void): void {
            if (this.socket) {
                console.log('Listening for participants added event from server');
                this.socket.on('conversation:participants_added', (data: any) => {
                    callback(data.updatedConversation); 
                });
            }
        }

        public removeParticipantsAddedServer(callback: (updatedConversation: Conversation) => void): void {
            if (this.socket) {
                this.socket.off('conversation:participants_added', callback);
            }
        }

        //==================================
        // Message handling
        //==================================

        public sendMessage(message: Message): void {
            if (this.socket) {
                console.log('Sending message to socket is: ', message);
                this.socket.emit('message:send', message);
            }
        }

        public onNewMessage(callback: (message: Message) => void): void {
            this.messageCallbacks.push(callback);
        }

        public removeMessageListener(callback: (message: Message) => void): void {
            this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
        }

        public sendSeen(messageId: string): void {
            if (this.socket) {
                this.socket.emit("message:seen", messageId);
            }
        }

        //==================================
        // Message deletion
        //==================================

        public sendDeleteMessage(message: Message): void {
            if (this.socket) {
                this.socket.emit('send_delete_message', message);
            }
        }

        public onDeleteMessage(callback: (message: Message) => void): void {
            this.deleteMessageCallbacks.push(callback);
        }

        //==================================
        // Pinned messages
        //==================================

        public pinMessage(data: { conversationId: string, messageId: string }): void {
            if (this.socket) {
                console.log('Pinning message:', data);
                this.socket.emit('message:pin', data);
            }
        }

        public onPinnedMessage(callback: (data: { conversationId: string, pinnedMessages: Message[] }) => void): void {
            this.pinnedMessageCallbacks.push(callback);
        }

        public removePinnedMessageListener(callback: (data: {
            conversationId: string,
            pinnedMessages: Message[]
        }) => void): void {
            this.pinnedMessageCallbacks = this.pinnedMessageCallbacks.filter(cb => cb !== callback);
        }

        //==================================
        // File attachments
        //==================================

        public sendAttachment(
            conversationId: string,
            fileData: {
                buffer: ArrayBuffer,
                fileName: string,
                contentType: string
            },
            repliedTold?: string
        ): void {
            if (this.socket) {
                console.log('Sending attachment to socket:', fileData.fileName);
                this.socket.emit('attachment:send', {
                    conversationId,
                    fileData,
                    repliedTold
                });
            }
        }

        public onAttachmentSent(callback: (data: { success: boolean, messageId: string }) => void): void {
            this.attachmentSentCallbacks.push(callback);
        }

        public onAttachmentError(callback: (error: { message: string }) => void): void {
            this.attachmentErrorCallbacks.push(callback);
        }

        public removeAttachmentSentListener(callback: (data: { success: boolean, messageId: string }) => void): void {
            this.attachmentSentCallbacks = this.attachmentSentCallbacks.filter(cb => cb !== callback);
        }

        public removeAttachmentErrorListener(callback: (error: { message: string }) => void): void {
            this.attachmentErrorCallbacks = this.attachmentErrorCallbacks.filter(cb => cb !== callback);
        }

        //==================================
        // Friend requests
        //==================================

        public sendFriendRequest(friendRequest: FriendRequest): void {
            if (this.socket) {
                this.socket.emit('friend_request:send', friendRequest);
            }
        }

        public onFriendRequest(callback: (friendRequest: FriendRequest) => void): void {
            this.friendRequestCallbacks.push(callback);
        }

        public removeFriendRequestListener(callback: (friendRequest: FriendRequest) => void): void {
            this.friendRequestCallbacks = this.friendRequestCallbacks.filter(cb => cb !== callback);
        }

        public sendAcceptFriendRequest(requestId: string): void {
            if (this.socket) {
                this.socket.emit("friend_request:accept", requestId);
            }
        }

        public sendDeleteFriendRequest(data: { senderId: string, receiverId: string }): void {
            if (this.socket) {
                this.socket.emit('friend_request:delete', data);
            }
        }

        public onDeleteFriendRequest(callback: (requestId: string, receiverId: string) => void): void {
            this.friendRequestActionCallbacks.push(callback);
        }

        public removeFriendRequestActionListener(callback: (requestId: string, receiverId: string) => void): void {
            this.friendRequestActionCallbacks = this.friendRequestActionCallbacks.filter(cb => cb !== callback);
        }

        //==================================
        // Voting
        //==================================

        public createVote(data: {
            conversationId: string,
            question: string,
            options: string[],
            multiple: boolean
        }): void {
            if (this.socket) {
                console.log('Creating vote:', data);
                this.socket.emit('vote:create', data);
            }
        }

        public submitVote(data: {
            conversationId: string,
            voteId: string,
            optionId: string
        }): void {
            if (this.socket) {
                console.log('Submitting vote:', data);
                this.socket.emit('vote:submit', data);
            }
        }

        public getVote(data: {
            conversationId: string,
            voteId: string
        }): void {
            if (this.socket) {
                console.log('Getting vote:', data);
                this.socket.emit('vote:get', data);
            }
        }

        public onVoteCreated(callback: (data: { conversationId: string, vote: Message }) => void): void {
            this.voteCreatedCallbacks.push(callback);
        }

        public onVoteUpdated(callback: (data: { conversationId: string, vote: Message }) => void): void {
            this.voteUpdatedCallbacks.push(callback);
        }

        public onVoteResult(callback: (data: { conversationId: string, vote: Message }) => void): void {
            this.voteResultCallbacks.push(callback);
        }

        public onVoteError(callback: (error: { message: string }) => void): void {
            this.voteErrorCallbacks.push(callback);
        }

        public removeVoteCreatedListener(callback: (data: { conversationId: string, vote: Message }) => void): void {
            this.voteCreatedCallbacks = this.voteCreatedCallbacks.filter(cb => cb !== callback);
        }

        public removeVoteUpdatedListener(callback: (data: { conversationId: string, vote: Message }) => void): void {
            this.voteUpdatedCallbacks = this.voteUpdatedCallbacks.filter(cb => cb !== callback);
        }

        public removeVoteResultListener(callback: (data: { conversationId: string, vote: Message }) => void): void {
            this.voteResultCallbacks = this.voteResultCallbacks.filter(cb => cb !== callback);
        }

        public removeVoteErrorListener(callback: (error: { message: string }) => void): void {
            this.voteErrorCallbacks = this.voteErrorCallbacks.filter(cb => cb !== callback);
        }

        //==================================
        // QR Login
        //==================================

        public generateLoginQR(): void {
            if (this.socket) {
                console.log('Generating QR code for login');
                this.socket.emit('loginQR:generate');
            }
        }

        public onGenerateLoginQR(callback: (data: { data: { deviceCode: string, socketId: string } }) => void): void {
            this.loginQRCallbacks.push(callback);
        }

        public removeGenerateLoginQRListener(callback: (data: { data: { deviceCode: string, socketId: string } }) => void): void {
            this.loginQRCallbacks = this.loginQRCallbacks.filter(cb => cb !== callback);
        }

        //==================================
        // Event setup
        //==================================

        private setupEventListeners(): void {
            if (!this.socket) return;

            // Connection events
            this.socket.on('connect', () => {
                console.log('Socket connected');
            });

            this.socket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            this.socket.on('pong', (message: string) => {
                console.log('Pong received: ', message);
            });

            this.socket.on('error', (error: { message: string }) => {
                console.error('Socket error:', error.message);
            });

            // Message events
            this.socket.on('message:new', (message: Message) => {
                console.log('New message received: ', message);
                this.messageCallbacks.forEach(callback => callback(message));
            });

            this.socket.on('delete_message', (message: Message) => {
                this.deleteMessageCallbacks.forEach(callback => callback(message));
            });

            this.socket.on('message:pinned', (data: { conversationId: string, pinnedMessages: Message[] }) => {
                console.log('Message pinned:', data);
                this.pinnedMessageCallbacks.forEach(callback => callback(data));
            });

            // Conversation events
            this.socket.on('conversation:new', (conversation: Conversation) => {
                this.conversationCallbacks.forEach(callback => callback(conversation));
            });

            this.socket.on('conversation:participants_added', (updatedConversation: Conversation) => {
                console.log('Participants added to conversation:', updatedConversation);
                this.participantsCallbacks.forEach(callback => callback(updatedConversation));
            });

            // Friend request events
            this.socket.on('friend_request:new', (friendRequest: FriendRequest) => {
                this.friendRequestCallbacks.forEach(callback => callback(friendRequest));
            });

            this.socket.on('friend_request:new_delete', (data: { senderId: string, receiverId: string }) => {
                console.log('Delete friend request received:', data);
                this.friendRequestActionCallbacks.forEach(callback => callback(data.senderId, data.receiverId));
            });

            // Attachment events
            this.socket.on('attachment:sent', (data: { success: boolean, messageId: string }) => {
                this.attachmentSentCallbacks.forEach(callback => callback(data));
            });

            this.socket.on('attachment:error', (error: { message: string }) => {
                console.error('Attachment error:', error.message);
                this.attachmentErrorCallbacks.forEach(callback => callback(error));
            });

            // Vote events
            this.socket.on('vote:created', (data: { conversationId: string, vote: Message }) => {
                console.log('Vote created received:', data);
                this.voteCreatedCallbacks.forEach(callback => callback(data));
            });

            this.socket.on('vote:updated', (data: { conversationId: string, vote: Message }) => {
                console.log('Vote updated received:', data);
                this.voteUpdatedCallbacks.forEach(callback => callback(data));
            });

            this.socket.on('vote:result', (data: { conversationId: string, vote: Message }) => {
                console.log('Vote result received:', data);
                this.voteResultCallbacks.forEach(callback => callback(data));
            });

            this.socket.on('vote:error', (error: { message: string }) => {
                console.error('Vote error:', error.message);
                this.voteErrorCallbacks.forEach(callback => callback(error));
            });
        }

        private setupEventListenersForQR(): void {
            if (!this.socket) return;

            this.socket.on('connect', () => {
                console.log('Socket connected for QR login');
            });

            this.socket.on('disconnect', () => {
                console.log('Socket disconnected for QR login');
            });

            this.socket.on('loginQR:generate', (data: { data: { deviceCode: string, socketId: string } }) => {
                this.loginQRCallbacks.forEach(callback => callback(data));
            });

            this.socket.on('error', (error: { message: string }) => {
                console.error('Socket error for QR login:', error.message);
            });
        }
    }

    export default SocketService;