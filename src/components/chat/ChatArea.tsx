import React, {useEffect, useRef, useState} from "react";
import {Animated, Easing, ScrollView, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Conversation} from "@/src/models/Conversation";
import {Message, MessageType} from "@/src/models/Message";
import {MessageService} from "@/src/api/services/MessageService";
import {useUser} from "@/src/contexts/user/UserContext";
import {UserService} from "@/src/api/services/UserService";
import SocketService from "@/src/api/services/SocketService";
import {AttachmentService} from "@/src/api/services/AttachmentService";
import {Attachment} from "@/src/models/Attachment";
import {useFileUpload} from "@/src/hooks/chat/useFileUpload";
import {useVoteCreation} from "@/src/hooks/chat/useVoteCreation";

// Component imports
import ChatHeader from "@/src/components/chat/misc/ChatHeader";
import MessageList from "@/src/components/chat/message/MessageList";
import ChatInputArea from "@/src/components/chat/input/ChatInputArea";
import ReplyPreviewBar from "@/src/components/chat/message/ReplyPreviewBar";
import PinnedMessagesPanel from "@/src/components/chat/message/PinnedMessagesPanel";
import ForwardMessageModal from "@/src/components/chat/modal/ForwardMessageModal";
import FileSelectionModal from "@/src/components/chat/modal/FileSelectionModal";
import UploadProgressModal from "@/src/components/chat/modal/UploadProgressModal";
import VoteCreationModal from "@/src/components/chat/modal/VoteCreationModal";
import FullScreenImageViewer from "@/src/components/chat/message/FullScreenImageViewer";
import MessageOptionsModal from "@/src/components/chat/modal/MessageOptionsModal";
import DeleteConfirmationModal from "@/src/components/chat/modal/DeleteConfirmationModal";

export interface ChatAreaProps {
    selectedChat: Conversation | null;
    onBackPress?: () => void;
    onInfoPress?: () => void;
}

export default function ChatArea(
    {
        selectedChat,
        onBackPress,
        onInfoPress,
    }: ChatAreaProps) {

    //================================================== State
    // Main chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewer, setIsNewer] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    // Message interaction state
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
    const [activeReactionId, setActiveReactionId] = useState<string | null>(null);

    // Pinned messages state
    const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
    const [showPinnedMessagesList, setShowPinnedMessagesList] = useState(false);
    const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

    // User and participant state
    const {user} = useUser();
    const [messageUsers, setMessageUsers] = useState<{ [key: string]: any }>({});
    const [otherParticipant, setOtherParticipant] = useState<{
        name: string;
        avatar: string;
        isOnline: boolean;
    } | null>(null);

    // Attachments state
    const [attachments, setAttachments] = useState<{ [key: string]: Attachment }>({});
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    // Modal visibility state
    const [showMessageOptions, setShowMessageOptions] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [isModalChecked, setIsModalChecked] = useState(false);
    const [isModelImage, setIsModelImage] = useState(false);
    const [isModelEmoji, setIsModelEmoji] = useState(false);
    const [isModelSticker, setIsModelSticker] = useState(false);
    const [isModelGift, setIsModelGift] = useState(false);

    // Vote creation state
    const {showVoteModal, toggleVoteModal, handleCreateVote} = useVoteCreation(selectedChat?.id);

    // Refs
    const scaleAnimation = useRef(new Animated.Value(0)).current;
    const socketService = useRef(SocketService.getInstance()).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const messageRefs = useRef<{ [key: string]: number }>({});

    // Fetch messages from server
    const fetchMessages = async () => {
        if (!selectedChat?.id) return;

        try {
            setLoading(true);

            const response = await MessageService.getMessages(selectedChat.id);

            if (response.success) {
                setMessages(response.messages);
                setIsNewer(response.isNewer);
                setError(null);
            } else {
                setError(response.statusMessage || "Unknown error occurred");
            }
        } catch (error) {
            const errorMessage = "Failed to load messages";
            console.error(`${errorMessage}:`, error);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const {
        uploadProgress,
        uploadStatusMessage,
        showUploadModal,
        handleSelectFile,
        closeUploadModal
    } = useFileUpload(selectedChat?.id, user?.id, fetchMessages);

    // ================================================== useEffect
    // Initialize conversation and fetch messages when a chat is selected
    useEffect(() => {
        if (selectedChat) {
            fetchMessages().then(() => {
            });
            socketService.joinConversation(selectedChat.id);
        }

        return () => {
            if (selectedChat) {
                socketService.leaveConversation(selectedChat.id);
            }
        };
    }, [selectedChat]);

    // Load initial pinned messages when conversation changes
    useEffect(() => {
        if (selectedChat?.pinMessages) {
            setPinnedMessages(selectedChat.pinMessages);
        } else {
            setPinnedMessages([]);
        }
    }, [selectedChat]);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({animated: true});
        }, 100);
    }, [messages]);

    // Listen for new messages
    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            if (message.conversationId === selectedChat?.id) {
                setMessages((prev) => [...prev, message]);

                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({animated: true});
                }, 100);

                socketService.sendSeen(message.id);
            }
        };

        socketService.onNewMessage(handleNewMessage);

        return () => {
            socketService.removeMessageListener(handleNewMessage);
        };
    }, [selectedChat?.id]);

    // Listen for vote creation events
    useEffect(() => {
        const handleVoteCreated = (data: { conversationId: string, vote: any }) => {
            if (data.conversationId === selectedChat?.id) {
                setMessages((prev) => [...prev, data.vote]);
            }
        };

        socketService.onVoteCreated(handleVoteCreated);

        return () => {
            socketService.removeVoteCreatedListener(handleVoteCreated);
        };
    }, [selectedChat?.id]);

    // Listen for pinned message updates
    useEffect(() => {
        const handlePinnedMessage = (data: { conversationId: string, pinnedMessages: Message[] }) => {
            if (data.conversationId === selectedChat?.id) {
                setPinnedMessages(data.pinnedMessages);
            }
        };

        socketService.onPinnedMessage(handlePinnedMessage);

        return () => {
            socketService.removePinnedMessageListener(handlePinnedMessage);
        };
    }, [selectedChat?.id]);

    // Fetch user info for each unique message sender
    useEffect(() => {
        const senderIds = [...new Set(messages.map((msg) => msg.senderId))];
        senderIds.forEach((id) => {
            if (!messageUsers[id]) {
                fetchUserInfo(id).then(() => {
                });
            }
        });
    }, [messages]);

    // Load other participant info for 1:1 chats
    useEffect(() => {
        const loadOtherParticipant = async () => {
            if (!selectedChat || !user) return;

            const otherUserId = selectedChat.participantIds.find(
                (id) => id !== user.id
            );
            if (!otherUserId) return;

            try {
                const response = await UserService.getUserById(otherUserId);
                if (response.success && response.user) {
                    setOtherParticipant({
                        name: response.user.name,
                        avatar:
                            response.user.avatarURL ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                response.user.name
                            )}&background=0068FF&color=fff`,
                        isOnline: response.user.isOnline,
                    });
                }
            } catch (error) {
                console.error("Error loading other participant:", error);
            }
        };

        loadOtherParticipant().then(() => {
        });
    }, [selectedChat, user]);

    // ================================================== Handlers
    // ================================================== Handlers

// Handles image selection and closes file selection modal
    const handleSelectImageWithClose = () => {
        handleSelectFile().then(() => {
        });
        toggleModalChecked();
    };

// Handles file selection and closes file selection modal
    const handleSelectFileWithClose = () => {
        handleSelectFile().then(() => {
        });
        toggleModalChecked();
    };

// Retrieves attachment for a specific message, using cache when available
    const getAttachmentByMessageId = async (messageId: string) => {
        try {
            if (attachments[messageId]) {
                return attachments[messageId];
            }

            const response = await AttachmentService.getAttachmentByMessageId(messageId);
            if (response.success && response.data && response.data.length > 0) {
                const attachment = response.data[0];
                setAttachments((prev) => ({
                    ...prev,
                    [messageId]: attachment,
                }));
                return attachment;
            }
            return null;
        } catch (error) {
            console.error("Error fetching attachment:", error);
            return null;
        }
    };

// Fetches user information and updates message users state
    const fetchUserInfo = async (userId: string) => {
        try {
            const response = await UserService.getUserById(userId);
            if (response.success) {
                setMessageUsers((prev) => ({
                    ...prev,
                    [userId]: response.user,
                }));
            }
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

// Toggles the file selection modal with animation
    const toggleModalChecked = () => {
        if (isModalChecked) {
            Animated.timing(scaleAnimation, {
                toValue: 0,
                duration: 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start(() => setIsModalChecked(false));
        } else {
            setIsModalChecked(true);
            Animated.timing(scaleAnimation, {
                toValue: 1,
                duration: 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        }
    };

// Toggle modal visibility functions
    const toggleModelImage = () => setIsModelImage(!isModelImage);
    const toggleModelEmoji = () => setIsModelEmoji(!isModelEmoji);
    const toggleModelSticker = () => setIsModelSticker(!isModelSticker);
    const toggleModelGift = () => setIsModelGift(!isModelGift);

// Sends a new message to the current conversation
    const handleSendMessage = async () => {
        if (!selectedChat?.id || !newMessage.trim() || !user?.id) return;

        const messageData: Message = {
            id: new Date().getTime().toString(),
            conversationId: selectedChat.id,
            senderId: user.id,
            content: newMessage.trim(),
            type: MessageType.TEXT,
            repliedToId: replyingTo?.id || "",
            readBy: [],
            sentAt: new Date().toISOString(),
        };

        try {
            socketService.sendMessage(messageData);
            setNewMessage("");
            setReplyingTo(null);
            setSelectedMessage(null);
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to send message");
        }
    };

    // Opens message options when a message is long-pressed
    const handleLongPressMessage = (msg: Message) => {
        setSelectedMessage(msg);
        setShowMessageOptions(true);
    };

    // Sets up a message to reply to
    const handleReplyMessage = (msg: Message) => {
        setReplyingTo(msg);
        setShowMessageOptions(false);
    };

    // Prepares a message to be forwarded
    const handleForwardMessage = (msg: Message) => {
        setReplyingTo(msg);
        setShowMessageOptions(false);
        setShowForwardModal(true);
    };

    // Prepares a message for deletion
    const handleDeleteMessage = (msg: Message) => {
        setMessageToDelete(msg);
        setShowDeleteConfirm(true);
        setShowMessageOptions(false);
    };

    // Confirms and executes message deletion
    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            const response = await MessageService.deleteMessage(messageToDelete.id);
            socketService.sendDeleteMessage(messageToDelete);

            if (response.success) {
                setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
                setShowDeleteConfirm(false);
                setMessageToDelete(null);
            } else {
                setError(response.statusMessage || "Không thể xóa tin nhắn");
            }
        } catch (err) {
            console.error("Error deleting message:", err);
            setError("Có lỗi xảy ra khi xóa tin nhắn");
        }
    };

    // Toggles reaction picker for a specific message
    const handleReactionToggle = (messageId: string) => {
        if (activeReactionId === messageId) {
            setActiveReactionId(null);
        } else {
            setActiveReactionId(messageId);
        }
    };

    // Handles adding a reaction to a message
    const handleReaction = (messageId: string, reactionId: string) => {
        console.log(`Reacted to message ${messageId} with reaction ${reactionId}`);

        const reactionData = {
            messageId: messageId,
            userId: user?.id || "",
            emoji: reactionId,
        };

        try {
            console.log("Reaction data:", reactionData);
        } catch (err) {
            console.error("Error sending reaction:", err);
            setError("Failed to send reaction");
        }

        setActiveReactionId(null);
    };

    // Forwards a message to multiple conversations
    const handleForward = async (selectedConversations: string[]) => {
        if (!replyingTo || !user?.id) return;

        try {
            for (const conversationId of selectedConversations) {
                const newMessage: Message = {
                    id: new Date().getTime().toString(),
                    conversationId: conversationId,
                    senderId: user.id,
                    content: replyingTo.content,
                    type: MessageType.TEXT,
                    repliedToId: replyingTo.id,
                    readBy: [],
                    sentAt: new Date().toISOString(),
                };

                socketService.sendMessage(newMessage);
            }

            setShowForwardModal(false);
            setReplyingTo(null);
        } catch (err) {
            console.error("Error forwarding message:", err);
            setError("Failed to forward message");
        }
    };

    // Pins a message in the conversation
    const handlePinMessage = (message: Message) => {
        if (!selectedChat) return;

        try {
            socketService.pinMessage({
                conversationId: selectedChat.id,
                messageId: message.id,
            });

            setShowMessageOptions(false);
        } catch (error) {
            console.error("Error pinning message:", error);
            setError("Failed to pin message");
        }
    };

    // Scrolls to a specific message and highlights it
    const scrollToMessage = (messageId: string) => {
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        if (messageIndex === -1) return;

        const yOffset = messageRefs.current[messageId] || messageIndex * 80;
        scrollViewRef.current?.scrollTo({y: yOffset, animated: true});

        setHighlightedMessageId(messageId);
        setTimeout(() => {
            setHighlightedMessageId(null);
        }, 1500);

        setShowPinnedMessagesList(false);
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-blue-50/50 rounded-2xl m-4">
                <View className="bg-white p-6 rounded-2xl shadow-sm items-center">
                    <Ionicons name="chatbubble-ellipses-outline" size={48} color="#3B82F6"/>
                    <Text className="text-blue-900 mt-4 text-center">
                        Chọn một cuộc trò chuyện để xem thông tin chi tiết
                    </Text>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Đang tải...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-500">Lỗi: {error}</Text>
            </View>
        );
    }

    if (!selectedChat) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <Text className="text-gray-500">
                    Chọn một cuộc trò chuyện để bắt đầu
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 flex-col">
            <ChatHeader
                selectedChat={selectedChat}
                onBackPress={onBackPress}
                onInfoPress={onInfoPress}
            />

            <MessageList
                scrollViewRef={scrollViewRef}
                messages={messages}
                messageUsers={messageUsers}
                currentUserId={user?.id}
                selectedChat={selectedChat}
                messageRefs={messageRefs}
                highlightedMessageId={highlightedMessageId}
                activeReactionId={activeReactionId}
                handleLongPressMessage={handleLongPressMessage}
                handleReactionToggle={handleReactionToggle}
                handleReaction={handleReaction}
                getAttachmentByMessageId={getAttachmentByMessageId}
                setFullScreenImage={setFullScreenImage}
                pinnedMessages={pinnedMessages}
            />

            {showMessageOptions && selectedMessage && (
                <MessageOptionsModal
                    selectedMessage={selectedMessage}
                    messageUsers={messageUsers}
                    currentUserId={user?.id}
                    onClose={() => setShowMessageOptions(false)}
                    onReply={handleReplyMessage}
                    onForward={handleForwardMessage}
                    onPin={handlePinMessage}
                    onDelete={handleDeleteMessage}
                />
            )}

            {showDeleteConfirm && messageToDelete && (
                <DeleteConfirmationModal
                    messageToDelete={messageToDelete}
                    onConfirmDelete={confirmDeleteMessage}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setMessageToDelete(null);
                    }}
                />
            )}

            {replyingTo && (
                <ReplyPreviewBar
                    replyingTo={replyingTo}
                    senderName={messageUsers[replyingTo.senderId]?.name}
                    onCancel={() => setReplyingTo(null)}
                />
            )}

            {showForwardModal && replyingTo && (
                <ForwardMessageModal
                    message={replyingTo}
                    onClose={() => setShowForwardModal(false)}
                    onForward={handleForward}
                />
            )}

            <ChatInputArea
                message={newMessage}
                onChangeMessage={setNewMessage}
                onSendMessage={handleSendMessage}
                onSelectFile={handleSelectFileWithClose}
                onToggleVoteModal={toggleVoteModal}
                openFileSelection={toggleModalChecked}
            />

            {fullScreenImage && (
                <FullScreenImageViewer
                    imageUri={fullScreenImage}
                    onClose={() => setFullScreenImage(null)}
                />
            )}

            <PinnedMessagesPanel
                pinnedMessages={pinnedMessages}
                messageUsers={messageUsers}
                onScrollToMessage={scrollToMessage}
            />

            <FileSelectionModal
                visible={isModalChecked}
                onClose={toggleModalChecked}
                onSelectImage={handleSelectImageWithClose}
                onSelectFile={handleSelectFileWithClose}
                scaleAnimation={scaleAnimation}
            />

            <UploadProgressModal
                visible={showUploadModal}
                progress={uploadProgress}
                statusMessage={uploadStatusMessage}
                onCancel={closeUploadModal}
            />

            <VoteCreationModal
                visible={showVoteModal}
                onClose={toggleVoteModal}
                onCreateVote={handleCreateVote}
            />
        </View>
    );
}