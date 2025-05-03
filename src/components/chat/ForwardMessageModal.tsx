import React, {useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Message} from '@/src/models/Message';

interface ForwardMessageModalProps {
    message: Message;
    onClose: () => void;
    onForward: (selectedConversations: string[]) => void;
}

// Mockup data cho danh sách cuộc trò chuyện
const mockConversations = [
    {
        id: '1',
        name: 'Nhóm Học Tập',
        avatar: 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=NH',
        lastMessage: 'Hôm nay học gì?',
        unreadCount: 2,
        isGroup: true
    },
    {
        id: '2',
        name: 'Nguyễn Văn A',
        avatar: 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=NA',
        lastMessage: 'Ok em',
        unreadCount: 0,
        isGroup: false
    },
    {
        id: '3',
        name: 'Nhóm Lớp CNM',
        avatar: 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=NC',
        lastMessage: 'Ai đi học không?',
        unreadCount: 5,
        isGroup: true
    },
    {
        id: '4',
        name: 'Trần Thị B',
        avatar: 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=TB',
        lastMessage: 'Chào bạn',
        unreadCount: 0,
        isGroup: false
    }
];

export default function ForwardMessageModal({message, onClose, onForward}: ForwardMessageModalProps) {
    const [selectedConversations, setSelectedConversations] = useState<string[]>([]);

    const toggleConversation = (conversationId: string) => {
        setSelectedConversations(prev => {
            if (prev.includes(conversationId)) {
                return prev.filter(id => id !== conversationId);
            } else {
                return [...prev, conversationId];
            }
        });
    };

    return (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <View className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden">
                {/* Header */}
                <View className="p-4 border-b border-gray-200 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-gray-900">Chuyển tiếp tin nhắn</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#666"/>
                    </TouchableOpacity>
                </View>

                {/* Tin nhắn được chọn */}
                <View className="p-4 border-b border-gray-200">
                    <View className="bg-gray-50 rounded-lg p-3">
                        <Text className="text-gray-800">{message.content}</Text>
                    </View>
                </View>

                {/* Danh sách cuộc trò chuyện */}
                <ScrollView className="max-h-[60vh]">
                    {mockConversations.map(conversation => (
                        <TouchableOpacity
                            key={conversation.id}
                            className="flex-row items-center p-4 border-b border-gray-100"
                            onPress={() => toggleConversation(conversation.id)}
                        >
                            <View className="relative">
                                <Image
                                    source={{uri: conversation.avatar}}
                                    className="w-12 h-12 rounded-full"
                                />
                                {conversation.isGroup && (
                                    <View className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                        <Ionicons name="people" size={12} color="white"/>
                                    </View>
                                )}
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-gray-900 font-medium">{conversation.name}</Text>
                                <Text className="text-gray-500 text-sm" numberOfLines={1}>
                                    {conversation.lastMessage}
                                </Text>
                            </View>
                            <View className="w-6 h-6 rounded-full border-2 border-blue-500 items-center justify-center"
                                  style={{
                                      backgroundColor: selectedConversations.includes(conversation.id) ? '#3B82F6' : 'transparent'
                                  }}
                            >
                                {selectedConversations.includes(conversation.id) && (
                                    <Ionicons name="checkmark" size={16} color="white"/>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Footer */}
                <View className="p-4 border-t border-gray-200 flex-row justify-between items-center">
                    <Text className="text-gray-500">
                        Đã chọn: {selectedConversations.length}
                    </Text>
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-lg ${selectedConversations.length > 0 ? 'bg-blue-500' : 'bg-gray-200'}`}
                        onPress={() => onForward(selectedConversations)}
                        disabled={selectedConversations.length === 0}
                    >
                        <Text
                            className={`font-medium ${selectedConversations.length > 0 ? 'text-white' : 'text-gray-500'}`}>
                            Chuyển tiếp
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
} 