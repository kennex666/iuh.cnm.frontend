import React, { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
    ActivityIndicator,
    Animated,
    Easing,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Conversation } from '@/src/models/Conversation';
import EmojiPicker from './EmojiPicker';
import StickerPicker from './StickerPicker';
import MessageReaction from './MessageReaction';
import { Shadows } from '@/src/styles/Shadow';
import { Message, MessageType } from '@/src/models/Message';
import { MessageService } from '@/src/api/services/MessageService';
import { useAuth } from '@/src/contexts/UserContext';
import { UserService } from '@/src/api/services/UserService';
import SocketService from '@/src/api/services/SocketService';


export interface ChatAreaProps {
    selectedChat: Conversation | null;
    onBackPress?: () => void;
    onInfoPress?: () => void;
}

export default function ChatArea({ selectedChat, onBackPress, onInfoPress }: ChatAreaProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
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
    const [messageUsers, setMessageUsers] = useState<{ [key: string]: any }>({});
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [showMessageOptions, setShowMessageOptions] = useState(false);

    const fetchUserInfo = async (userId: string) => {
        try {
            const response = await UserService.getUserById(userId);
            if (response.success) {
                setMessageUsers(prev => ({
                    ...prev,
                    [userId]: response.user
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
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    // Listen for new messages
    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            if (message.conversationId === selectedChat?.id) {
                setMessages(prev => [...prev, message]);
                // Scroll to bottom when new message arrives
                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
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
        const senderIds = [...new Set(messages.map(msg => msg.senderId))];
        senderIds.forEach(id => {
            if (!messageUsers[id]) {
                fetchUserInfo(id);
            }
        });
    }, [messages]);

    // Send message to server
    const handleSendMessage = async () => {
        if (!selectedChat?.id || !newMessage.trim() || !user?.id) return;

        const messageData: Message = {
            id: new Date().getTime().toString(),
            conversationId: selectedChat.id,
            senderId: user.id,
            content: newMessage.trim(),
            type: MessageType.TEXT,
            repliedToId: undefined,
            readBy: [],
            sentAt: new Date().toISOString()
        };

        try {
            // Send through socket
            socketService.sendMessage(messageData);
            
            setNewMessage('');
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
        setActiveReactionId(null);
        // TODO: Implement reaction handling
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
        setReplyingTo(msg);
        setShowMessageOptions(false);
        // Focus vào input
    };

    const handleForwardMessage = async (msg: Message) => {
        // TODO: Implement forward message logic
        setShowMessageOptions(false);
    };

    const handleDeleteMessage = async (msg: Message) => {
        try {
            // TODO: Call API to delete message
            setMessages(prev => prev.filter(m => m.id !== msg.id));
            setShowMessageOptions(false);
        } catch (err) {
            console.error('Error deleting message:', err);
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
            <View className="h-14 px-4 border-b border-gray-200 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    {onBackPress && (
                        <TouchableOpacity onPress={onBackPress} className="mr-3">
                            <Ionicons name="arrow-back" size={24} color="#666" />
                        </TouchableOpacity>
                    )}
                    <Image
                        source={{ uri: selectedChat.avatar || 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=G' }}
                        className="w-10 h-10 rounded-full"
                        resizeMode="cover"
                    />
                    <View className="ml-3" style={{ maxWidth: '45%' }}>
                        <Text className="font-semibold text-gray-900 text-base"
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {selectedChat.name || selectedChat.participants.join(', ')}
                        </Text>
                        {selectedChat.isGroup && (
                            <Text className="text-sm text-gray-500">{selectedChat.participants.length} thành
                                viên</Text>
                        )}
                        {!selectedChat.isGroup && selectedChat.participants.length > 0 && (
                            <Text className="text-sm text-green-500">Đang hoạt động</Text>
                        )}
                    </View>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity className="p-2 mr-1"
                        onPress={() => {
                            socketService.ping();
                        }}
                    >
                        <Ionicons name="call-outline" size={22} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 mr-1">
                        <Ionicons name="videocam-outline" size={22} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2" onPress={onInfoPress}>
                        <Ionicons name="information-circle-outline" size={24} color="#666" />
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
                {isNewer && (
                    <View className="items-center justify-center mb-8">
                        <View className="bg-blue-50 rounded-2xl p-6 max-w-[80%] items-center">
                            <Ionicons name="chatbubble-ellipses-outline" size={48} color="#3B82F6" />
                            <Text className="text-blue-600 font-semibold text-lg mt-4 text-center">
                                Bắt đầu cuộc trò chuyện mới
                            </Text>
                            <Text className="text-gray-600 text-center mt-2">
                                Hãy gửi lời chào để bắt đầu kết nối với {selectedChat.name || 'người dùng này'}
                            </Text>
                        </View>
                    </View>
                )}
                {messages.map((msg, index) => (
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
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View
                            className={`flex-row items-end mb-4 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.senderId !== user?.id && (
                                <Image
                                    source={{
                                        uri: messageUsers[msg.senderId]?.avatarURL || 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=G'
                                    }}
                                    className="w-8 h-8 rounded-full mr-2"
                                    resizeMode="cover"
                                />
                            )}
                            <View 
                                className={`max-w-[70%] flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'}`}
                            >
                                {msg.repliedToId && (
                                    <View className="bg-gray-50 rounded-lg px-3 py-2 mb-1 border-l-2 border-blue-500">
                                        <Text className="text-xs text-gray-500">
                                            Trả lời {messageUsers[messages.find(m => m.id === msg.repliedToId)?.senderId || '']?.name}
                                        </Text>
                                        <Text className="text-sm text-gray-700" numberOfLines={1}>
                                            {messages.find(m => m.id === msg.repliedToId)?.content}
                                        </Text>
                                    </View>
                                )}
                                <View 
                                    className={`rounded-2xl px-4 py-2 ${
                                        msg.senderId === user?.id 
                                            ? 'bg-blue-500 rounded-br-none' 
                                            : 'bg-gray-100 rounded-bl-none'
                                    }`}
                                >
                                    <Text className={msg.senderId === user?.id ? 'text-white' : 'text-gray-900'}>
                                        {msg.content}
                                    </Text>
                                </View>
                                <Text className="text-xs text-gray-500 mt-1">
                                    {new Date(msg.sentAt).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </Text>
                                <MessageReaction
                                    messageId={msg.id}
                                    isVisible={activeReactionId === msg.id}
                                    onReact={handleReaction}
                                    onToggle={() => handleReactionToggle(msg.id)}
                                    isSender={msg.senderId === user?.id}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Message Options Modal */}
            {showMessageOptions && selectedMessage && (
                <View className="absolute inset-0 bg-black/30 items-center justify-center">
                    <View className="bg-white rounded-lg w-[80%] overflow-hidden">
                        <View className="p-4 border-b border-gray-100">
                            <Text className="text-gray-500 text-sm">Tin nhắn của {messageUsers[selectedMessage.senderId]?.name}</Text>
                            <Text className="text-gray-800 mt-1">{selectedMessage.content}</Text>
                            <Text className="text-gray-400 text-xs mt-1">
                                {new Date(selectedMessage.sentAt).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            className="flex-row items-center p-4 border-b border-gray-100"
                            onPress={() => handleReplyMessage(selectedMessage)}
                        >
                            <Ionicons name="return-up-back" size={24} color="#3B82F6" />
                            <Text className="ml-3 text-gray-800">Trả lời</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            className="flex-row items-center p-4 border-b border-gray-100"
                            onPress={() => handleForwardMessage(selectedMessage)}
                        >
                            <Ionicons name="arrow-redo" size={24} color="#3B82F6" />
                            <Text className="ml-3 text-gray-800">Chuyển tiếp</Text>
                        </TouchableOpacity>
                        {selectedMessage.senderId === user?.id && (
                            <TouchableOpacity 
                                className="flex-row items-center p-4"
                                onPress={() => handleDeleteMessage(selectedMessage)}
                            >
                                <Ionicons name="trash" size={24} color="#EF4444" />
                                <Text className="ml-3 text-red-500">Xóa tin nhắn</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            className="absolute top-0 right-0 p-4"
                            onPress={() => setShowMessageOptions(false)}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Reply Preview */}
            {replyingTo && (
                <View className="bg-gray-50 px-4 py-2 flex-row items-center border-t border-gray-200">
                    <View className="flex-1">
                        <Text className="text-blue-500 text-sm font-medium">
                            Trả lời {messageUsers[replyingTo.senderId]?.name}
                        </Text>
                        <Text className="text-gray-600 text-sm" numberOfLines={1}>
                            {replyingTo.content}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        className="p-2"
                        onPress={() => setReplyingTo(null)}
                    >
                        <Ionicons name="close" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Input Area */}
            <View className="border-t border-gray-200 p-4">
                <View className="flex-row items-center position-relative">
                    <TouchableOpacity className="p-2" onPress={toggleModelChecked}>
                        <Ionicons name="add-circle-outline" size={24} color="#666" />
                    </TouchableOpacity>
                    {isModelChecked && (
                        <View className='absolute bottom-full left-0 bg-white z-50'>
                            <Animated.View
                                style={{
                                    transform: [
                                        {
                                            translateX: scaleAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 0],
                                            }),
                                        },
                                        {
                                            translateY: scaleAnimation.interpolate({
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
                                    style={Shadows.md}>
                                    <Text className="text-gray-800 mb-2">Chọn loại tệp</Text>

                                    <TouchableOpacity className="flex-row items-center mb-2" onPress={toggleModelImage}>
                                        <Ionicons name="image-outline" size={24} color="#666" />
                                        <Text className="ml-2  text-gray-800">Hình ảnh</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center mb-2">
                                        <Ionicons name="file-tray-full-outline" size={24} color="#666" />
                                        <Text className="ml-2 text-gray-800">File</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center mb-2" onPress={toggleModelGift}>
                                        <Ionicons name="gift-outline" size={24} color="#666" />
                                        <Text className="ml-2 text-gray-800">Quà tặng</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>
                    )}
                    <View className='relative'>
                        <TouchableOpacity className="p-2" onPress={toggleModelSticker}>
                            <Ionicons name="gift-outline" size={24} color="#666" />
                        </TouchableOpacity>
                        {isModelSticker && (
                            <View
                                className='absolute bottom-full bg-white z-50 left-0 rounded-lg overflow-hidden border border-gray-200'
                                style={Shadows.xl}>
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
                                outline: 'none',
                                height: Math.min(inputHeight, 26 * 3),
                            }}
                            onContentSizeChange={(event) => {
                                const { height } = event.nativeEvent.contentSize;
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
                    <View className='relative'>
                        <TouchableOpacity className="p-2" onPress={toggleModelEmoji}>
                            <Ionicons name="happy-outline" size={24} color="#666" />
                        </TouchableOpacity>
                        {
                            isModelEmoji && (
                                <View
                                    className='absolute bottom-full bg-white z-50 right-0 w-[300px] rounded-lg overflow-hidden border border-gray-200'
                                    style={Shadows.xl}>
                                    <EmojiPicker setMessage={setNewMessage} toggleModelEmoji={toggleModelEmoji} />
                                </View>
                            )
                        }
                    </View>
                    <TouchableOpacity
                        className={`p-3 rounded-full ${newMessage.trim() ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                        onPress={handleSendMessage}
                        disabled={!newMessage.trim()}
                        style={[
                            newMessage.trim() && Shadows.md,
                            {
                                transform: [{ scale: newMessage.trim() ? 1 : 0.95 }]
                            }
                        ]}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={newMessage.trim() ? '#FFF' : '#999'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}