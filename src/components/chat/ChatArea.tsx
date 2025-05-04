import React, {useEffect, useRef, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {Animated, Easing, ScrollView, Text, View,} from "react-native";
import {Conversation} from "@/src/models/Conversation";
import {Message, MessageType} from "@/src/models/Message";
import {MessageService} from "@/src/api/services/MessageService";
import {useUser} from "@/src/contexts/user/UserContext";
import {UserService} from "@/src/api/services/UserService";
import SocketService from "@/src/api/services/SocketService";
import ForwardMessageModal from "./modal/ForwardMessageModal";
import {AttachmentService} from "@/src/api/services/AttachmentService";
import {Attachment} from "@/src/models/Attachment";
import ChatHeader from "./misc/ChatHeader";
import {useFileUpload} from "@/src/hooks/chat/useFileUpload";
import FileSelectionModal from "@/src/components/chat/modal/FileSelectionModal";
import UploadProgressModal from "@/src/components/chat/modal/UploadProgressModal";
import VoteCreationModal from "@/src/components/chat/modal/VoteCreationModal";
import {useVoteCreation} from "@/src/hooks/chat/useVoteCreation";
import MessageList from "@/src/components/chat/message/MessageList";
import FullScreenImageViewer from "@/src/components/chat/message/FullScreenImageViewer";
import PinnedMessagesPanel from "@/src/components/chat/message/PinnedMessagesPanel";
import MessageOptionsModal from "@/src/components/chat/modal/MessageOptionsModal";
import DeleteConfirmationModal from "@/src/components/chat/modal/DeleteConfirmationModal";
import ReplyPreviewBar from "@/src/components/chat/message/ReplyPreviewBar";
import ChatInputArea from "@/src/components/chat/input/ChatInputArea";

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
    const {user} = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewer, setIsNewer] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
    const [isModalChecked, setIsModalChecked] = useState(false);
    const [isModelImage, setIsModelImage] = useState(false);
    const [isModelEmoji, setIsModelEmoji] = useState(false);
    const [isModelSticker, setIsModelSticker] = useState(false);
    const [isModelGift, setIsModelGift] = useState(false);
    const scaleAnimation = useRef(new Animated.Value(0)).current;
    const socketService = useRef(SocketService.getInstance()).current;
    const scrollViewRef = useRef<ScrollView>(null);

    const [inputHeight, setInputHeight] = useState(28);
    const [messageUsers, setMessageUsers] = useState<{ [key: string]: any }>({});
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [showMessageOptions, setShowMessageOptions] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);
    const [showForwardModal, setShowForwardModal] = useState(false);
    const [otherParticipant, setOtherParticipant] = useState<{
        name: string;
        avatar: string;
        isOnline: boolean;
    } | null>(null);

    const [attachments, setAttachments] = useState<{ [key: string]: Attachment }>(
        {}
    );
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);


    // Update the getAttachmentByMessageId function
    const getAttachmentByMessageId = async (messageId: string) => {
        try {
            // Check if we already have the attachment in local state
            if (attachments[messageId]) {
                return attachments[messageId];
            }

            // If not, fetch it from the server
            const response = await AttachmentService.getAttachmentByMessageId(
                messageId
            );

            if (response.success && response.data && response.data.length > 0) {
                const attachment = response.data[0]; // Get the first attachment if there are multiple

                // Save to local state for future use
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

    // Fetch messages from server
    const fetchMessages = async () => {
        if (!selectedChat?.id) return;

        try {
            setLoading(true);
            const response = await MessageService.getMessages(selectedChat.id);
            console.log("response fetch messages: ", response);
            if (response.success) {
                setMessages(response.messages);
                setIsNewer(response.isNewer);
                setError(null);
            } else {
                setError(response.statusMessage);
            }
        } catch (err) {
            setError("Failed to load messages");
            console.error("Error fetching messages:", err);
        } finally {
            setLoading(false);
        }
    };

    // Refactoring: File Upload
    const {
        uploadProgress,
        uploadStatusMessage,
        showUploadModal,
        handleSelectFile,
        closeUploadModal
    } = useFileUpload(selectedChat?.id, user?.id, fetchMessages);

    const handleSelectImageWithClose = () => {
        handleSelectFile().then(() => {
        });
        toggleModalChecked();
    };

    const handleSelectFileWithClose = () => {
        handleSelectFile().then(() => {
        });
        toggleModalChecked();
    };

    //// End Refactoring: File Upload

    // Refactoring: Vote Creation

    const {showVoteModal, toggleVoteModal, handleCreateVote} = useVoteCreation(selectedChat?.id);

    //// End Refactoring: Vote Creation

    // Join conversation when component mounts
    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
            socketService.joinConversation(selectedChat.id);
        }

        // Cleanup function to leave conversation when component unmounts or conversation changes
        return () => {
            if (selectedChat) {
                socketService.leaveConversation(selectedChat.id);
            }
        };
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
                // Scroll to bottom when new message arrives
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({animated: true});
                }, 100);

                socketService.sendSeen(message.id);
            }
        };

        socketService.onNewMessage(handleNewMessage);
        // Cleanup on unmount
        return () => {
            socketService.removeMessageListener(handleNewMessage);
        };
    }, [selectedChat?.id]);

    // Fetch user info for each unique sender
    useEffect(() => {
        const senderIds = [...new Set(messages.map((msg) => msg.senderId))];
        senderIds.forEach((id) => {
            if (!messageUsers[id]) {
                fetchUserInfo(id);
            }
        });
        // load lai messages
    }, [messages]);

    // Load other participant info when selectedChat changes
    useEffect(() => {
        const loadOtherParticipant = async () => {
            if (!selectedChat || !user) return;

            // Find the other participant's ID
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

        loadOtherParticipant();
    }, [selectedChat, user]);

    // Send message to server
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
            // Send through socket
            socketService.sendMessage(messageData);

            setNewMessage("");
            setReplyingTo(null);
            setSelectedMessage(null);
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to send message");
        }
    };

    const handleReactionToggle = (messageId: string) => {
        if (activeReactionId === messageId) {
            setActiveReactionId(null);
        } else {
            setActiveReactionId(messageId);
        }
    };

    const handleReaction = (messageId: string, reactionId: string) => {
        console.log(`Reacted to message ${messageId} with reaction ${reactionId}`);

        const reactionData = {
            messageId: messageId,
            userId: user?.id || "",
            emoji: reactionId,
        };

        try {
            // TODO: Implement reaction handling
            console.log("Reaction data:", reactionData);
        } catch (err) {
            console.error("Error sending reaction:", err);
            setError("Failed to send reaction");
        }

        setActiveReactionId(null);
    };

    const handleForward = async (selectedConversations: string[]) => {
        if (!replyingTo || !user?.id) return;

        try {
            // Tạo tin nhắn mới cho mỗi cuộc trò chuyện được chọn
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

                // Gửi tin nhắn qua socket
                socketService.sendMessage(newMessage);
            }

            // Đóng modal và reset state
            setShowForwardModal(false);
            setReplyingTo(null);
        } catch (err) {
            console.error("Error forwarding message:", err);
            setError("Failed to forward message");
        }
    };

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

    const toggleModelImage = () => {
        setIsModelImage(!isModelImage);
    };

    const toggleModelEmoji = () => {
        setIsModelEmoji(!isModelEmoji);
        console.log("Emoji model toggled: ", isModelEmoji);
    };

    const toggleModelSticker = () => {
        setIsModelSticker(!isModelSticker);
    };

    const toggleModelGift = () => {
        setIsModelGift(!isModelGift);
    };

    const handleLongPressMessage = (msg: Message) => {
        setSelectedMessage(msg);
        setShowMessageOptions(true);
    };

    const handleReplyMessage = (msg: Message) => {
        console.log("msg now: ", msg);
        setReplyingTo(msg);
        setShowMessageOptions(false);
        // Focus vào input
    };

    const handleForwardMessage = async (msg: Message) => {
        // Set the message being forwarded as the replyingTo message
        setReplyingTo(msg);
        setShowMessageOptions(false);
        setShowForwardModal(true);
        // Focus vào input để người dùng có thể nhập nội dung forward
    };

    const handleDeleteMessage = async (msg: Message) => {
        setMessageToDelete(msg);
        setShowDeleteConfirm(true);
        setShowMessageOptions(false);
    };

    useEffect(() => {
        const handleVoteCreated = (data: { conversationId: string, vote: any }) => {
            if (data.conversationId === selectedChat?.id) {
                // Add the new vote message to the list
                setMessages((prev) => [...prev, data.vote]);
            }
        };

        socketService.onVoteCreated(handleVoteCreated);

        return () => {
            socketService.removeVoteCreatedListener(handleVoteCreated);
        };
    }, [selectedChat?.id]);

    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            console.log("messageToDelete: ", messageToDelete.id);
            const response = await MessageService.deleteMessage(messageToDelete.id);
            console.log("response delete message: ", response);
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

    const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
    const [showPinnedMessagesList, setShowPinnedMessagesList] = useState(false);
    const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
    const messageRefs = useRef<{ [key: string]: number }>({});

    const handlePinMessage = (message: Message) => {
        if (!selectedChat) return;

        try {
            // Send pin message request to server
            socketService.pinMessage({
                conversationId: selectedChat.id,
                messageId: message.id,
            });

            // Close message options modal
            setShowMessageOptions(false);
        } catch (error) {
            console.error("Error pinning message:", error);
            setError("Failed to pin message");
        }
    };

// Add listener for pinned messages
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

// Load initial pinned messages when conversation is selected
    useEffect(() => {
        if (selectedChat?.pinMessages) {
            setPinnedMessages(selectedChat.pinMessages);
        } else {
            setPinnedMessages([]);
        }
    }, [selectedChat]);

    const scrollToMessage = (messageId: string) => {
        // Find the message index in the messages array
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        if (messageIndex === -1) return;

        // Get the position from refs or calculate approximate position
        const yOffset = messageRefs.current[messageId] || messageIndex * 80;

        scrollViewRef.current?.scrollTo({y: yOffset, animated: true});

        // Highlight the message briefly
        setHighlightedMessageId(messageId);
        setTimeout(() => {
            setHighlightedMessageId(null);
        }, 1500);

        // Close the pinned messages list
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