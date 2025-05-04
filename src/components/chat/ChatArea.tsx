import React, {useEffect, useRef, useState} from "react";
import {Ionicons} from "@expo/vector-icons";
import {Animated, Easing, Image, ScrollView, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {Conversation} from "@/src/models/Conversation";
import EmojiPicker from "./EmojiPicker";
import StickerPicker from "./StickerPicker";
import {Shadows} from "@/src/styles/Shadow";
import {Message, MessageType} from "@/src/models/Message";
import {MessageService} from "@/src/api/services/MessageService";
import {useUser} from "@/src/contexts/user/UserContext";
import {UserService} from "@/src/api/services/UserService";
import SocketService from "@/src/api/services/SocketService";
import ForwardMessageModal from "./ForwardMessageModal";
import {AttachmentService} from "@/src/api/services/AttachmentService";
import {Attachment} from "@/src/models/Attachment";
import ChatHeader from "./misc/ChatHeader";
import {useFileUpload} from "@/src/hooks/chat/useFileUpload";
import FileSelectionModal from "@/src/components/chat/modal/FileSelectionModal";
import UploadProgressModal from "@/src/components/chat/modal/UploadProgressModal";
import VoteCreationModal from "@/src/components/chat/modal/VoteCreationModal";
import {useVoteCreation} from "@/src/hooks/chat/useVoteCreation";
import MessageList from "@/src/components/chat/message/MessageList";

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

            {/* Message Options Modal */}
            {showMessageOptions && selectedMessage && (
                <View className="absolute inset-0 bg-black/30 items-center justify-center">
                    <View className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden shadow-lg">
                        {/* Modal content */}
                        <View className="p-4 border-b border-gray-100">
                            <View className="flex-row items-center">
                                <Image
                                    source={{
                                        uri:
                                            messageUsers[selectedMessage.senderId]?.avatarURL ||
                                            "https://placehold.co/40x40/0068FF/FFFFFF/png?text=G",
                                    }}
                                    className="w-10 h-10 rounded-full"
                                    resizeMode="cover"
                                />
                                <View className="ml-3 flex-1">
                                    <Text className="text-gray-800 font-medium">
                                        {messageUsers[selectedMessage.senderId]?.name}
                                    </Text>
                                    <Text className="text-gray-500 text-sm">
                                        {new Date(selectedMessage.sentAt).toLocaleString("vi-VN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </Text>
                                </View>
                            </View>
                            <View className="mt-3 bg-gray-50 rounded-lg p-3">
                                <Text className="text-gray-800">{selectedMessage.content}</Text>
                            </View>
                        </View>
                        <View className="divide-y divide-gray-100">
                            <TouchableOpacity
                                className="flex-row items-center p-4 active:bg-gray-50"
                                onPress={() => {
                                    handleReplyMessage(selectedMessage);
                                }}
                            >
                                <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                                    <Ionicons name="return-up-back" size={20} color="#3B82F6"/>
                                </View>
                                <Text className="ml-3 text-gray-800">Trả lời</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center p-4 active:bg-gray-50"
                                onPress={() => handleForwardMessage(selectedMessage)}
                            >
                                <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                                    <Ionicons name="arrow-redo" size={20} color="#3B82F6"/>
                                </View>
                                <Text className="ml-3 text-gray-800">Chuyển tiếp</Text>
                            </TouchableOpacity>

                            {/* Add pin message option */}
                            <TouchableOpacity
                                className="flex-row items-center p-4 active:bg-gray-50"
                                onPress={() => handlePinMessage(selectedMessage)}
                            >
                                <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                                    <Ionicons name="pin" size={20} color="#3B82F6"/>
                                </View>
                                <Text className="ml-3 text-gray-800">Ghim tin nhắn</Text>
                            </TouchableOpacity>

                            {selectedMessage.senderId === user?.id && (
                                <TouchableOpacity
                                    className="flex-row items-center p-4 active:bg-gray-50"
                                    onPress={() => handleDeleteMessage(selectedMessage)}
                                >
                                    <View className="w-8 h-8 rounded-full bg-red-50 items-center justify-center">
                                        <Ionicons name="trash" size={20} color="#EF4444"/>
                                    </View>
                                    <Text className="ml-3 text-red-500">Xóa tin nhắn</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
                            onPress={() => setShowMessageOptions(false)}
                        >
                            <Ionicons name="close" size={20} color="#666"/>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && messageToDelete && (
                <View className="absolute inset-0 bg-black/30 items-center justify-center">
                    {/* Delete modal content */}
                    <View className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden shadow-lg">
                        <View className="p-6 items-center">
                            <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4">
                                <Ionicons name="trash" size={32} color="#EF4444"/>
                            </View>
                            <Text className="text-xl font-semibold text-gray-800 mb-2">
                                Xóa tin nhắn
                            </Text>
                            <Text className="text-gray-600 text-center">
                                Bạn có chắc chắn muốn xóa tin nhắn này?{"\n"}
                                Hành động này không thể hoàn tác.
                            </Text>
                        </View>
                        <View className="flex-row p-4 border-t border-gray-100">
                            <TouchableOpacity
                                className="flex-1 mr-2 h-12 rounded-xl bg-gray-100 items-center justify-center active:bg-gray-200"
                                onPress={() => {
                                    setShowDeleteConfirm(false);
                                    setMessageToDelete(null);
                                }}
                            >
                                <Text className="text-gray-800 font-medium">Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 h-12 rounded-xl bg-red-500 items-center justify-center active:bg-red-600"
                                onPress={confirmDeleteMessage}
                            >
                                <Text className="text-white font-medium">Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Reply Preview */}
            {replyingTo && (
                <View className="bg-gray-50 px-4 py-3 flex-row items-center border-t border-gray-200">
                    <View className="flex-1">
                        <View className="flex-row items-center">
                            <Ionicons name="return-up-back" size={16} color="#3B82F6"/>
                            <Text className="text-blue-500 text-sm font-medium ml-1">
                                Trả lời {messageUsers[replyingTo.senderId]?.name}
                            </Text>
                        </View>
                        <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
                            {replyingTo.content}
                        </Text>
                    </View>
                    <TouchableOpacity
                        className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
                        onPress={() => setReplyingTo(null)}
                    >
                        <Ionicons name="close" size={16} color="#666"/>
                    </TouchableOpacity>
                </View>
            )}

            {/* Forward Message Modal */}
            {showForwardModal && replyingTo && (
                <ForwardMessageModal
                    message={replyingTo}
                    onClose={() => setShowForwardModal(false)}
                    onForward={handleForward}
                />
            )}

            {/* Input Area */}
            <View className="border-t border-gray-200 p-4">
                <View className="flex-row items-center position-relative">
                    <TouchableOpacity className="p-2" onPress={toggleModalChecked}>
                        <Ionicons name="add-circle-outline" size={24} color="#666"/>
                    </TouchableOpacity>

                    <View className="relative">
                        <TouchableOpacity className="p-2" onPress={toggleModelSticker}>
                            <Ionicons name="gift-outline" size={24} color="#666"/>
                        </TouchableOpacity>
                        {isModelSticker && (
                            <View
                                className="absolute bottom-full bg-white z-50 left-0 rounded-lg overflow-hidden border border-gray-200"
                                style={Shadows.xl}
                            >
                                <StickerPicker
                                    setMessage={setNewMessage}
                                    toggleModelSticker={toggleModelSticker}
                                />
                            </View>
                        )}
                    </View>

                    <View className="relative">
                        <TouchableOpacity className="p-2" onPress={toggleVoteModal}>
                            <Ionicons name="bar-chart-outline" size={24} color="#666"/>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 bg-gray-100 rounded-full mx-2 px-4 py-2">
                        <TextInput
                            className="min-h-[26px] text-base text-gray-800"
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                            numberOfLines={1}
                            placeholderTextColor="#666"
                            style={{
                                borderWidth: 0,
                                outline: "none",
                                height: Math.min(inputHeight, 26 * 3),
                            }}
                            onContentSizeChange={(event) => {
                                const {height} = event.nativeEvent.contentSize;
                                setInputHeight(height > 26 ? height : 26);
                            }}
                            onBlur={() => {
                                if (inputHeight < 28) {
                                    setInputHeight(28);
                                }
                            }}
                            onFocus={() => {
                                setInputHeight(28);
                            }}
                        />
                    </View>

                    <View className="relative">
                        <TouchableOpacity className="p-2" onPress={toggleModelEmoji}>
                            <Ionicons name="happy-outline" size={24} color="#666"/>
                        </TouchableOpacity>
                        {isModelEmoji && (
                            <View
                                className="absolute bottom-full bg-white z-50 right-0 w-[300px] rounded-lg overflow-hidden border border-gray-200"
                                style={Shadows.xl}
                            >
                                <EmojiPicker
                                    setMessage={setNewMessage}
                                    toggleModelEmoji={toggleModelEmoji}
                                />
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        className={`p-3 rounded-full ${
                            newMessage.trim() ? "bg-blue-500" : "bg-gray-200"
                        }`}
                        onPress={handleSendMessage}
                        disabled={!newMessage.trim()}
                        style={[
                            newMessage.trim() && Shadows.md,
                            {
                                transform: [{scale: newMessage.trim() ? 1 : 0.95}],
                            },
                        ]}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={newMessage.trim() ? "#FFF" : "#999"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Full Screen Image Viewer */}
            {fullScreenImage && (
                <View className="absolute inset-0 bg-black z-50 flex-1 justify-center items-center">
                    <Image
                        source={{uri: fullScreenImage}}
                        className="w-full h-full"
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        className="absolute top-10 right-5 bg-black/30 rounded-full p-2"
                        onPress={() => setFullScreenImage(null)}
                    >
                        <Ionicons name="close" size={24} color="white"/>
                    </TouchableOpacity>
                </View>
            )}

            {pinnedMessages.length > 0 && (
                <View className="absolute top-[70px] left-2 right-2 z-10 items-center">
                    <TouchableOpacity
                        className="bg-white rounded-lg p-3 mx-3 shadow-md w-[95%] flex-row items-center justify-between"
                        onPress={() => setShowPinnedMessagesList(!showPinnedMessagesList)}
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="pin" size={16} color="#3B82F6"/>
                            <Text className="text-gray-700 ml-2 font-medium">
                                {pinnedMessages.length} tin nhắn được ghim
                            </Text>
                        </View>
                        <Ionicons
                            name={showPinnedMessagesList ? "chevron-up" : "chevron-down"}
                            size={16}
                            color="#666"
                        />
                    </TouchableOpacity>

                    {showPinnedMessagesList && (
                        <View className="bg-white rounded-lg mt-1 mx-3 p-2 shadow-md w-[95%] max-h-[300px]">
                            <ScrollView className="max-h-[300px]">
                                {pinnedMessages.map((pinnedMsg) => {
                                    const sender = messageUsers[pinnedMsg.senderId];
                                    return (
                                        <TouchableOpacity
                                            key={pinnedMsg.id}
                                            className="p-3 border-b border-gray-100 active:bg-gray-50"
                                            onPress={() => scrollToMessage(pinnedMsg.id)}
                                        >
                                            <View className="flex-row items-center">
                                                <Image
                                                    source={{
                                                        uri: sender?.avatarURL ||
                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                sender?.name || "User"
                                                            )}&background=0068FF&color=fff`
                                                    }}
                                                    className="w-8 h-8 rounded-full"
                                                    resizeMode="cover"
                                                />
                                                <View className="ml-2 flex-1">
                                                    <Text className="font-medium text-gray-800">
                                                        {sender?.name || "Unknown User"}
                                                    </Text>
                                                    <Text className="text-gray-500 text-sm" numberOfLines={2}>
                                                        {pinnedMsg.content}
                                                    </Text>
                                                </View>
                                                <Ionicons name="chevron-forward" size={16} color="#666"/>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    )}
                </View>
            )}

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