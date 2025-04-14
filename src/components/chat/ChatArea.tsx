import React, {useRef, useState, useEffect} from 'react';
import {Ionicons} from '@expo/vector-icons';
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
import {UseMessage} from '@/src/hooks/UseMessage';
import {Conversation} from '@/src/models/Conversation';
import EmojiPicker from './EmojiPicker';
import StickerPicker from './StickerPicker';
import MessageReaction from './MessageReaction';
import {Shadows} from '@/src/styles/Shadow';
import {Message, MessageType} from '@/src/models/Message';
import {MessageService} from '@/src/api/services/MessageService';
import {useAuth} from '@/src/contexts/UserContext';

export interface ChatAreaProps {
    selectedChat: Conversation | null;
    onBackPress?: () => void;
    onInfoPress?: () => void;
}

export default function ChatArea({selectedChat, onBackPress, onInfoPress}: ChatAreaProps) {
    const {user} = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
    const [isModelChecked, setIsModelChecked] = useState(false);
    const [isModelImage, setIsModelImage] = useState(false);
    const [isModelEmoji, setIsModelEmoji] = useState(false);
    const [isModelSticker, setIsModelSticker] = useState(false);
    const [isModelGift, setIsModelGift] = useState(false);
    const scaleAnimation = useRef(new Animated.Value(0)).current;

    const [inputHeight, setInputHeight] = useState(28);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
        }
    }, [selectedChat]);

    const fetchMessages = async () => {
        if (!selectedChat?.id) return;
        
        try {
            setLoading(true);
            const response = await MessageService.getMessages(selectedChat.id);
            if (response.success) {
                setMessages(response.messages);
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

    const handleSendMessage = async () => {
        if (!selectedChat?.id || !newMessage.trim() || !user) return;

        try {
            const messageData: Partial<Message> = {
                conversationId: selectedChat.id,
                content: newMessage.trim(),
                type: MessageType.TEXT,
                senderId: user.id
            };

            const response = await MessageService.sendMessage(messageData);
            if (response.success) {
                setMessages(prev => [...prev, response.message]);
                setNewMessage('');
            }
        } catch (err) {
            console.error('Error sending message:', err);
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
                            <Ionicons name="arrow-back" size={24} color="#666"/>
                        </TouchableOpacity>
                    )}
                    <Image
                        source={{uri: selectedChat.avatar || 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=G'}}
                        className="w-10 h-10 rounded-full"
                    />
                    <View className="ml-3" style={{maxWidth: '45%'}}>
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
                    <TouchableOpacity className="p-2 mr-1">
                        <Ionicons name="call-outline" size={22} color="#666"/>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 mr-1">
                        <Ionicons name="videocam-outline" size={22} color="#666"/>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2" onPress={onInfoPress}>
                        <Ionicons name="information-circle-outline" size={24} color="#666"/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Messages Area */}
            <ScrollView className="flex-1 p-4">
                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        className={`flex-row items-end mb-4 ${msg.senderId === 'u1' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.senderId !== 'u1' && (
                            <Image
                                source={{uri: 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=G'}}
                                className="w-8 h-8 rounded-full mr-2"
                            />
                        )}
                        <View className={`flex flex-col ${msg.senderId === 'u1' ? 'items-end' : 'items-start'}`}>
                            <View
                                className={`rounded-2xl px-4 py-2 max-w-[70%] ${msg.senderId === 'u1' ? 'bg-blue-500' : 'bg-gray-100'}`}>
                                <Text className={msg.senderId === 'u1' ? 'text-white' : 'text-gray-900'}>
                                    {msg.content}
                                </Text>
                            </View>
                            <MessageReaction
                                messageId={msg.id}
                                isVisible={activeReactionId === msg.id}
                                onReact={handleReaction}
                                onToggle={() => handleReactionToggle(msg.id)}
                                isSender={msg.senderId === 'u1'}
                            />
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Input Area */}
            <View className="border-t border-gray-200 p-4">
                <View className="flex-row items-center position-relative">
                    <TouchableOpacity className="p-2" onPress={toggleModelChecked}>
                        <Ionicons name="add-circle-outline" size={24} color="#666"/>
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
                                        <Ionicons name="image-outline" size={24} color="#666"/>
                                        <Text className="ml-2  text-gray-800">Hình ảnh</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center mb-2">
                                        <Ionicons name="file-tray-full-outline" size={24} color="#666"/>
                                        <Text className="ml-2 text-gray-800">File</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-row items-center mb-2" onPress={toggleModelGift}>
                                        <Ionicons name="gift-outline" size={24} color="#666"/>
                                        <Text className="ml-2 text-gray-800">Quà tặng</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>
                    )}
                    <View className='relative'>
                        <TouchableOpacity className="p-2" onPress={toggleModelSticker}>
                            <Ionicons name="gift-outline" size={24} color="#666"/>
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
                    <View className='relative'>
                        <TouchableOpacity className="p-2" onPress={toggleModelEmoji}>
                            <Ionicons name="happy-outline" size={24} color="#666"/>
                        </TouchableOpacity>
                        {
                            isModelEmoji && (
                                <View
                                    className='absolute bottom-full bg-white z-50 right-0 w-[300px] rounded-lg overflow-hidden border border-gray-200'
                                    style={Shadows.xl}>
                                    <EmojiPicker setMessage={setNewMessage} toggleModelEmoji={toggleModelEmoji}/>
                                </View>
                            )
                        }
                    </View>
                    <TouchableOpacity
                        className={`p-2 rounded-full ${
                            newMessage.trim() ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        onPress={handleSendMessage}
                        disabled={!newMessage.trim()}
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