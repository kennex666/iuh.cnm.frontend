import React, {useEffect, useRef, useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import {
    ActivityIndicator,
    Animated,
    Easing,
    Image,
    Linking,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {Conversation} from '@/src/models/Conversation';
import EmojiPicker from './EmojiPicker';
import StickerPicker from './StickerPicker';
import MessageReaction from './MessageReaction';
import {Shadows} from '@/src/styles/Shadow';
import {Message, MessageType} from '@/src/models/Message';
import {MessageService} from '@/src/api/services/MessageService';
import {useAuth} from '@/src/contexts/UserContext';
import {UserService} from '@/src/api/services/UserService';
import SocketService from '@/src/api/services/SocketService';
import ForwardMessageModal from './ForwardMessageModal';

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {AttachmentService} from '@/src/api/services/AttachmentService';
import {Attachment} from '@/src/models/Attachment';
import axios from 'axios';
import FileMessageContent from './FileMessageContent';

export interface ChatAreaProps {
    selectedChat: Conversation | null;
    onBackPress?: () => void;
    onInfoPress?: () => void;
}

export default function ChatArea({selectedChat, onBackPress, onInfoPress}: ChatAreaProps) {
    const {user} = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesReplied, setMessagesReplied] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewer, setIsNewer] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
    const [isModelChecked, setIsModelChecked] = useState(false);
    const [isModelImage, setIsModelImage] = useState(false);
    const [isModelEmoji, setIsModelEmoji] = useState(false);
    const [isModelSticker, setIsModelSticker] = useState(false);
    const [isModelGift, setIsModelGift] = useState(false);
    const scaleAnimation = useRef(new Animated.Value(0)).current;
    const socketService = useRef(SocketService.getInstance()).current;
    const scrollViewRef = useRef<ScrollView>(null);

    const [inputHeight, setInputHeight] = useState(28);
    const [messageUsers, setMessageUsers] = useState<{[key: string]: any}>({});
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

    // Thêm vào danh sách state trong ChatArea
    const [fileUploading, setFileUploading] = useState(false);
    const [attachments, setAttachments] = useState<{[key: string]: Attachment}>({});
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

    // Add these to your state variables at the top of the component
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatusMessage, setUploadStatusMessage] = useState('Preparing to upload...');
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Thêm hàm xử lý chọn file
    const handleSelectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Cho phép chọn mọi loại file
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                console.log('User cancelled file picker');
                return;
            }

            await uploadAndSendFile(result.assets[0]);
        } catch (error) {
            console.error('Error picking document:', error);
            setError('Không thể chọn file. Vui lòng thử lại.');
        }
    };

    const uploadAndSendFile = async (fileAsset: DocumentPicker.DocumentPickerAsset) => {
        if (!selectedChat?.id || !user?.id) return;

        const isLargeFile = (fileAsset.size || 0) > 10 * 1024 * 1024;

        try {
            // Show upload modal
            setShowUploadModal(true);
            setFileUploading(true);
            setError(null);
            setUploadProgress(0);
            setUploadStatusMessage('Preparing file...');

            if (isLargeFile) {
                setUploadStatusMessage('File too large. Please try again.');
                // setShowUploadModal(false);
                // setError('Tệp quá lớn. Vui lòng thử lại.');
                return;
            }

            // Chuẩn bị fileData để gửi qua socket
            let fileBuffer: ArrayBuffer;

            setUploadStatusMessage('Reading file content...');
            setUploadProgress(10);

            // Đọc nội dung file theo cách phù hợp với platform
            if (Platform.OS === 'web') {
                // Web platform handling
                const response = await fetch(fileAsset.uri);
                const blob = await response.blob();
                fileBuffer = await blob.arrayBuffer();
            } else {
                // Mobile platform handling
                const base64 = await FileSystem.readAsStringAsync(fileAsset.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                // Chuyển Base64 thành ArrayBuffer
                const binaryString = atob(base64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                fileBuffer = bytes.buffer;
            }

            setUploadProgress(40);
            setUploadStatusMessage('Preparing to send file...');

            // Cấu trúc dữ liệu file để gửi qua socket
            const fileData = {
                buffer: fileBuffer,
                fileName: fileAsset.name,
                contentType: fileAsset.mimeType || 'application/octet-stream',
            };

            setUploadProgress(50);
            setUploadStatusMessage('Setting up connection...');

            // Lắng nghe phản hồi từ socket về việc gửi attachment thành công
            const attachmentSentHandler = (data: {success: boolean; messageId: string}) => {
                console.log('Attachment sent successfully:', data);
                if (data.success) {
                    setUploadProgress(100);
                    setUploadStatusMessage('File sent successfully!');

                    // Sau khi gửi thành công, cập nhật danh sách tin nhắn
                    fetchMessages();

                    // Reset reply state nếu có
                    if (replyingTo) {
                        setReplyingTo(null);
                    }

                    // Close modal after short delay to show success
                    setTimeout(() => {
                        setShowUploadModal(false);
                    }, 800);
                }
                // Gỡ bỏ event listener sau khi nhận được phản hồi
                socketService.removeAttachmentSentListener(attachmentSentHandler);
            };

            // Lắng nghe lỗi từ socket (nếu có)
            const attachmentErrorHandler = (error: {message: string}) => {
                console.error('Attachment error:', error.message);
                setUploadStatusMessage(`Error: ${error.message}`);
                setError(`Không thể gửi tệp đính kèm: ${error.message}`);

                // Close modal after showing error
                setTimeout(() => {
                    setShowUploadModal(false);
                }, 2000);

                // Gỡ bỏ event listener sau khi nhận được lỗi
                socketService.removeAttachmentErrorListener(attachmentErrorHandler);
            };

            // Đăng ký các event handlers
            socketService.onAttachmentSent(attachmentSentHandler);
            socketService.onAttachmentError(attachmentErrorHandler);

            setUploadProgress(70);
            setUploadStatusMessage('Sending file via socket...');

            // Gửi file thông qua socket
            socketService.sendAttachment(
                selectedChat.id,
                fileData,
                replyingTo?.id // Truyền repliedTold nếu có
            );

            setUploadProgress(80);
            setUploadStatusMessage('Waiting for server confirmation...');

            console.log(`Sending file via socket: ${fileAsset.name}`);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatusMessage('Upload failed');
            setError(
                typeof error === 'string'
                    ? error
                    : error instanceof Error
                    ? error.message
                    : 'Không thể gửi file. Vui lòng thử lại.'
            );

            // Close modal after showing error
            setTimeout(() => {
                setShowUploadModal(false);
            }, 2000);
        } finally {
            setFileUploading(false);
            toggleModelChecked(); // Đóng modal chọn loại file
        }
    };

    // Update the getAttachmentByMessageId function
    const getAttachmentByMessageId = async (messageId: string) => {
        try {
            // Check if we already have the attachment in local state
            if (attachments[messageId]) {
                return attachments[messageId];
            }

            // If not, fetch it from the server
            const response = await AttachmentService.getAttachmentByMessageId(messageId);

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
            console.error('Error fetching attachment:', error);
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
            console.error('Error fetching user:', err);
        }
    };

    // Fetch messages from server
    const fetchMessages = async () => {
        if (!selectedChat?.id) return;

        try {
            setLoading(true);
            const response = await MessageService.getMessages(selectedChat.id);
            console.log('response fetch messages: ', response);
            if (response.success) {
                setMessages(response.messages);
                setIsNewer(response.isNewer);
                setError(null);
            } else {
                setError(response.statusMessage);
            }
        } catch (err) {
            setError('Failed to load messages');
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    // Join conversation when component mounts
    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
            // Join new conversation
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
            const otherUserId = selectedChat.participants.find((id) => id !== user.id);
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
                console.error('Error loading other participant:', error);
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
            repliedToId: replyingTo?.id || '',
            readBy: [],
            sentAt: new Date().toISOString(),
        };

        try {
            // Send through socket
            socketService.sendMessage(messageData);

            setNewMessage('');
            setReplyingTo(null);
            setSelectedMessage(null);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message');
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
            userId: user?.id || '',
            emoji: reactionId
        };

        try {
            // TODO: Implement reaction handling
            console.log('Reaction data:', reactionData);
        } catch (err) {
            console.error('Error sending reaction:', err);
            setError('Failed to send reaction');
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
                    sentAt: new Date().toISOString()
                };

                // Gửi tin nhắn qua socket
                socketService.sendMessage(newMessage);
            }

            // Đóng modal và reset state
            setShowForwardModal(false);
            setReplyingTo(null);
        } catch (err) {
            console.error('Error forwarding message:', err);
            setError('Failed to forward message');
        }
    };

    // Toggle models
    const toggleModelChecked = () => {
        if (isModelChecked) {
            Animated.timing(scaleAnimation, {
                toValue: 0,
                duration: 100,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start(() => setIsModelChecked(false));
        } else {
            setIsModelChecked(true);
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
        console.log('Emoji model toggled: ', isModelEmoji);
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
        console.log('msg now: ', msg);
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

    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            console.log('messageToDelete: ', messageToDelete.id);
            const response = await MessageService.deleteMessage(messageToDelete.id);
            console.log('response delete message: ', response);
            socketService.sendDeleteMessage(messageToDelete);
            if (response.success) {
                setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
                setShowDeleteConfirm(false);
                setMessageToDelete(null);
            } else {
                setError(response.statusMessage || 'Không thể xóa tin nhắn');
            }
        } catch (err) {
            console.error('Error deleting message:', err);
            setError('Có lỗi xảy ra khi xóa tin nhắn');
        }
    };

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
                <Text className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</Text>
            </View>
        );
    }

    return (
		<View className="flex-1 flex-col">
			{/* Chat Header */}
			<View className="h-20 px-4 border-b border-gray-200 flex-row items-center justify-between">
				<View className="flex-row items-center flex-1">
					{onBackPress && (
						<TouchableOpacity
							onPress={onBackPress}
							className="mr-3"
						>
							<Ionicons
								name="arrow-back"
								size={24}
								color="#666"
							/>
						</TouchableOpacity>
					)}
					<Image
						source={{
							uri:
								selectedChat.avatar ||
								"https://placehold.co/40x40/0068FF/FFFFFF/png?text=G",
						}}
						className="w-11 h-11 rounded-full"
						resizeMode="cover"
						onError={() => {
							setOtherParticipant((prev) =>
								prev
									? {
											...prev,
											avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
												prev.name
											)}&background=0068FF&color=fff`,
									  }
									: null
							);
						}}
					/>
					<View className="ml-3" style={{ maxWidth: "45%" }}>
						<Text
							className="font-semibold text-gray-900 text-lg"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{selectedChat.name ||
								selectedChat.participants.join(", ")}
						</Text>
						{selectedChat.isGroup && (
							<Text className="text-sm text-gray-500">
								{selectedChat.participants.length} thành viên
							</Text>
						)}
						{!selectedChat.isGroup &&
							selectedChat.participants.length > 0 && (
								<Text className="text-sm text-green-500">
									Đang hoạt động
								</Text>
							)}
					</View>
				</View>
				<View className="flex-row items-center">
					<TouchableOpacity
						className="p-2 mr-1"
						onPress={() => {
							MessageService.makeACall(selectedChat.id);
						}}
					>
						<Ionicons name="call-outline" size={22} color="#666" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							MessageService.makeACall(selectedChat.id);
						}}
						className="p-2 mr-1"
					>
						<Ionicons
							name="videocam-outline"
							size={22}
							color="#666"
						/>
					</TouchableOpacity>
					<TouchableOpacity className="p-2" onPress={onInfoPress}>
						<Ionicons
							name="information-circle-outline"
							size={24}
							color="#666"
						/>
					</TouchableOpacity>
				</View>
			</View>

			{/* Messages Area */}
			<ScrollView
				ref={scrollViewRef}
				className="flex-1 p-4"
				onContentSizeChange={() => {
					scrollViewRef.current?.scrollToEnd({ animated: true });
				}}
			>
				{messages.length === 0 && (
					<View className="items-center justify-center mb-8">
						<View className="bg-blue-50 rounded-2xl p-6 max-w-[80%] items-center">
							<Ionicons
								name="chatbubble-ellipses-outline"
								size={48}
								color="#3B82F6"
							/>
							<Text className="text-blue-600 font-semibold text-lg mt-4 text-center">
								Chưa có tin nhắn nào
							</Text>
							<Text className="text-gray-600 text-center mt-2">
								Hãy gửi lời chào để bắt đầu cuộc trò chuyện với{" "}
								{selectedChat.name || "người dùng này"}
							</Text>
						</View>
					</View>
				)}
				{isNewer && (
					<View className="items-center justify-center mb-8">
						<View className="bg-blue-50 rounded-2xl p-6 max-w-[80%] items-center">
							<Ionicons
								name="chatbubble-ellipses-outline"
								size={48}
								color="#3B82F6"
							/>
							<Text className="text-blue-600 font-semibold text-lg mt-4 text-center">
								Bắt đầu cuộc trò chuyện mới
							</Text>
							<Text className="text-gray-600 text-center mt-2">
								Hãy gửi lời chào để bắt đầu kết nối với{" "}
								{selectedChat.name || "người dùng này"}
							</Text>
						</View>
					</View>
				)}
				{messages.map((msg) => {
					const repliedToMessage =
						msg.repliedToId || msg.repliedTold
							? messages.find(
									(m) =>
										m.id == msg.repliedToId ||
										m.id == msg.repliedTold
							  )
							: null;
					return (
						<TouchableOpacity
							key={msg.id}
							onLongPress={() => handleLongPressMessage(msg)}
							onPress={() => {
								// Nhấn một lần để hiện thông tin tin nhắn
								setSelectedMessage(msg);
								setShowMessageOptions(true);
							}}
							delayLongPress={200}
							activeOpacity={0.7}
							hitSlop={{
								top: 10,
								bottom: 10,
								left: 10,
								right: 10,
							}}
						>
							<View
								className={`flex-row items-end mb-4 ${
									msg.senderId === user?.id
										? "justify-end"
										: "justify-start"
								}`}
							>
								{msg.senderId !== user?.id && (
									<Image
										source={{
											uri:
												messageUsers[msg.senderId]
													?.avatarURL ||
												"https://placehold.co/40x40/0068FF/FFFFFF/png?text=G",
										}}
										className="w-8 h-8 rounded-full mr-2"
										resizeMode="cover"
									/>
								)}
								<View
									className={`relative max-w-[70%] flex flex-col ${
										msg.senderId === user?.id
											? "items-end"
											: "items-start"
									}`}
								>
									{(msg.repliedToId || msg.repliedTold) && (
										<View className="bg-gray-50 rounded-lg px-3 py-2 mb-1 border-l-2 border-blue-500">
											<Text className="text-xs text-gray-500">
												Trả lời tin nhắn
											</Text>
											<Text
												className="text-sm text-gray-700"
												numberOfLines={1}
											>
												{repliedToMessage?.content ||
													"Tin nhắn đã bị xoá"}
											</Text>
										</View>
									)}
									<View
										className={`rounded-xl ${
											msg.senderId === user?.id
												? "bg-blue-500 rounded-br-none"
												: "bg-gray-100 rounded-bl-none"
										}`}
										style={{
											paddingLeft: 10,
											paddingRight: 12,
											paddingVertical: 8,
										}}
									>
										{msg.type === MessageType.TEXT ? (
											<Text
												className={
													msg.senderId === user?.id
														? "text-white"
														: "text-gray-900"
												}
											>
												{msg.content}
											</Text>
										) : msg.type === MessageType.FILE ? (
											<View className="flex-row items-center">
												{/* Wrap this in a useEffect or Promise to get attachment info when component renders */}
												<FileMessageContent
													messageId={msg.id}
													fileName={msg.content}
													isSender={
														msg.senderId ===
														user?.id
													}
													getAttachment={
														getAttachmentByMessageId
													}
													onImagePress={
														setFullScreenImage
													}
												/>
											</View>
										) : (
											msg.type === MessageType.CALL && (
												<Text
													className={
														msg.senderId ===
														user?.id
															? "text-white"
															: "text-gray-900"
													}
												>
													{msg.content === "start"
														? "📞 Cuộc gọi đang bắt đầu"
														: "📴 Cuộc gọi đã kết thúc"}
												</Text>
											)
										)}
									</View>
									<MessageReaction
										messageId={msg.id}
										isVisible={activeReactionId === msg.id}
										onReact={handleReaction}
										onToggle={() =>
											handleReactionToggle(msg.id)
										}
										isSender={msg.senderId === user?.id}
									/>
								</View>
							</View>
						</TouchableOpacity>
					);
				})}
			</ScrollView>

			{/* Message Options Modal */}
			{showMessageOptions && selectedMessage && (
				<View className="absolute inset-0 bg-black/30 items-center justify-center">
					<View className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden shadow-lg">
						<View className="p-4 border-b border-gray-100">
							<View className="flex-row items-center">
								<Image
									source={{
										uri:
											messageUsers[
												selectedMessage.senderId
											]?.avatarURL ||
											"https://placehold.co/40x40/0068FF/FFFFFF/png?text=G",
									}}
									className="w-10 h-10 rounded-full"
									resizeMode="cover"
								/>
								<View className="ml-3 flex-1">
									<Text className="text-gray-800 font-medium">
										{
											messageUsers[
												selectedMessage.senderId
											]?.name
										}
									</Text>
									<Text className="text-gray-500 text-sm">
										{new Date(
											selectedMessage.sentAt
										).toLocaleString("vi-VN", {
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
								<Text className="text-gray-800">
									{selectedMessage.content}
								</Text>
							</View>
						</View>
						<View className="divide-y divide-gray-100">
							<TouchableOpacity
								className="flex-row items-center p-4 active:bg-gray-50"
								onPress={() => {
									console.log(
										"selectedMessage: ",
										selectedMessage
									);
									handleReplyMessage(selectedMessage);
								}}
							>
								<View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
									<Ionicons
										name="return-up-back"
										size={20}
										color="#3B82F6"
									/>
								</View>
								<Text className="ml-3 text-gray-800">
									Trả lời
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-row items-center p-4 active:bg-gray-50"
								onPress={() =>
									handleForwardMessage(selectedMessage)
								}
							>
								<View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
									<Ionicons
										name="arrow-redo"
										size={20}
										color="#3B82F6"
									/>
								</View>
								<Text className="ml-3 text-gray-800">
									Chuyển tiếp
								</Text>
							</TouchableOpacity>
							{selectedMessage.senderId === user?.id && (
								<TouchableOpacity
									className="flex-row items-center p-4 active:bg-gray-50"
									onPress={() =>
										handleDeleteMessage(selectedMessage)
									}
								>
									<View className="w-8 h-8 rounded-full bg-red-50 items-center justify-center">
										<Ionicons
											name="trash"
											size={20}
											color="#EF4444"
										/>
									</View>
									<Text className="ml-3 text-red-500">
										Xóa tin nhắn
									</Text>
								</TouchableOpacity>
							)}
						</View>
						<TouchableOpacity
							className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
							onPress={() => setShowMessageOptions(false)}
						>
							<Ionicons name="close" size={20} color="#666" />
						</TouchableOpacity>
					</View>
				</View>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && messageToDelete && (
				<View className="absolute inset-0 bg-black/30 items-center justify-center">
					<View className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden shadow-lg">
						<View className="p-6 items-center">
							<View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4">
								<Ionicons
									name="trash"
									size={32}
									color="#EF4444"
								/>
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
								<Text className="text-gray-800 font-medium">
									Hủy
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="flex-1 h-12 rounded-xl bg-red-500 items-center justify-center active:bg-red-600"
								onPress={confirmDeleteMessage}
							>
								<Text className="text-white font-medium">
									Xóa
								</Text>
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
							<Ionicons
								name="return-up-back"
								size={16}
								color="#3B82F6"
							/>
							<Text className="text-blue-500 text-sm font-medium ml-1">
								Trả lời{" "}
								{messageUsers[replyingTo.senderId]?.name}
							</Text>
						</View>
						<Text
							className="text-gray-600 text-sm mt-1"
							numberOfLines={1}
						>
							{replyingTo.content}
						</Text>
					</View>
					<TouchableOpacity
						className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
						onPress={() => setReplyingTo(null)}
					>
						<Ionicons name="close" size={16} color="#666" />
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
					<TouchableOpacity
						className="p-2"
						onPress={toggleModelChecked}
					>
						<Ionicons
							name="add-circle-outline"
							size={24}
							color="#666"
						/>
					</TouchableOpacity>
					{isModelChecked && (
						<View className="absolute bottom-full left-0 bg-white z-50">
							<Animated.View
								style={{
									transform: [
										{
											translateX:
												scaleAnimation.interpolate({
													inputRange: [0, 1],
													outputRange: [0, 0],
												}),
										},
										{
											translateY:
												scaleAnimation.interpolate({
													inputRange: [0, 1],
													outputRange: [30, 0],
												}),
										},
									],
									opacity: scaleAnimation.interpolate({
										inputRange: [0, 1],
										outputRange: [0, 1],
									}),
								}}
							>
								<View
									className="bg-white rounded-lg p-4 w-[300px]"
									style={Shadows.md}
								>
									<Text className="text-gray-800 mb-2">
										Chọn loại tệp
									</Text>

									<TouchableOpacity
										className="flex-row items-center mb-2"
										onPress={handleSelectFile}
									>
										<Ionicons
											name="image-outline"
											size={24}
											color="#666"
										/>
										<Text className="ml-2  text-gray-800">
											Hình ảnh/Video
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										className="flex-row items-center mb-2"
										onPress={handleSelectFile}
									>
										<Ionicons
											name="file-tray-full-outline"
											size={24}
											color="#666"
										/>
										<Text className="ml-2 text-gray-800">
											File
										</Text>
									</TouchableOpacity>
									{/* <TouchableOpacity
										className="flex-row items-center mb-2"
										onPress={toggleModelGift}
									>
										<Ionicons
											name="gift-outline"
											size={24}
											color="#666"
										/>
										<Text className="ml-2 text-gray-800">
											Quà tặng
										</Text> */}
									{/* </TouchableOpacity> */}
								</View>
							</Animated.View>
						</View>
					)}
					<View className="relative">
						<TouchableOpacity
							className="p-2"
							onPress={toggleModelSticker}
						>
							<Ionicons
								name="gift-outline"
								size={24}
								color="#666"
							/>
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
								const { height } =
									event.nativeEvent.contentSize;
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
						<TouchableOpacity
							className="p-2"
							onPress={toggleModelEmoji}
						>
							<Ionicons
								name="happy-outline"
								size={24}
								color="#666"
							/>
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
								transform: [
									{ scale: newMessage.trim() ? 1 : 0.95 },
								],
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
			{fullScreenImage && (
				<View className="absolute inset-0 bg-black z-50 flex-1 justify-center items-center">
					<Image
						source={{ uri: fullScreenImage }}
						className="w-full h-full"
						resizeMode="contain"
					/>
					<TouchableOpacity
						className="absolute top-10 right-5 bg-black/30 rounded-full p-2"
						onPress={() => setFullScreenImage(null)}
					>
						<Ionicons name="close" size={24} color="white" />
					</TouchableOpacity>
				</View>
			)}
			{showUploadModal && (
				<View className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center">
					<View className="bg-white rounded-2xl p-5 w-[85%] max-w-md">
						<View className="items-center">
							<View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mb-4">
								{uploadProgress < 100 ? (
									<Ionicons
										name="cloud-upload-outline"
										size={32}
										color="#3B82F6"
									/>
								) : (
									<Ionicons
										name="checkmark-circle"
										size={32}
										color="#10B981"
									/>
								)}
							</View>
							<Text className="text-lg font-medium text-gray-900 mb-2">
								{uploadProgress < 100
									? "Uploading File"
									: "Upload Complete"}
							</Text>
							<Text className="text-gray-600 text-center mb-4">
								{uploadStatusMessage}
							</Text>
						</View>

						{/* Progress Bar */}
						<View className="bg-gray-200 h-2 rounded-full mb-4 overflow-hidden">
							<View
								className="bg-blue-500 h-full rounded-full"
								style={{ width: `${uploadProgress}%` }}
							/>
						</View>

						{/* Cancel button - only show during active upload */}
						{uploadProgress < 100 && (
							<TouchableOpacity
								className="mt-2 py-3 px-4 rounded-lg bg-gray-100 items-center"
								onPress={() => {
									// Add cancellation logic here if possible
									setShowUploadModal(false);
									// setError('Upload cancelled');
								}}
							>
								<Text className="text-gray-700 font-medium">
									Cancel
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			)}
		</View>
	);
}
