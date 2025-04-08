import React from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Conversation, useConversations} from '../../hook/useConversations';

interface ConversationsProps {
    selectedChat: Conversation | null;
    onSelectChat: (chat: Conversation) => void;
}

export default function Conversations({selectedChat, onSelectChat}: ConversationsProps) {
    const {conversations, loading, error} = useConversations();

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-500">Error: {error}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 border-r border-gray-200">
            {/* Search Bar */}
            <View className="p-4 border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Ionicons name="search-outline" size={20} color="#666"/>
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Tìm kiếm"
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* Conversations List */}
            <ScrollView className="flex-1">
                {conversations.map((conversation) => (
                    <TouchableOpacity
                        key={conversation.id}
                        className={`flex-row items-center p-4 ${
                            selectedChat?.id === conversation.id ? 'bg-blue-50' : ''
                        }`}
                        onPress={() => onSelectChat(conversation)}
                    >
                        <View className="relative">
                            <Image
                                source={{uri: conversation.avatarUrl || 'https://placehold.co/48x48/0068FF/FFFFFF/png?text=G'}}
                                className="w-12 h-12 rounded-full"
                            />
                            {!conversation.isGroup && conversation.participantIds.length > 0 && (
                                <View
                                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"/>
                            )}
                        </View>
                        <View className="flex-1 ml-3">
                            <View className="flex-row justify-between items-center">
                                <Text className="font-semibold text-gray-900">
                                    {conversation.name || conversation.participantIds.join(', ')}
                                </Text>
                                {conversation.lastMessage && (
                                    <Text className="text-sm text-gray-500">
                                        {formatTime(conversation.lastMessage.sentAt)}
                                    </Text>
                                )}
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm text-gray-500 flex-1 mr-2" numberOfLines={1}>
                                    {conversation.lastMessage?.content || 'No messages yet'}
                                </Text>
                                {conversation.lastMessage && conversation.lastMessage.readBy.length === 0 && (
                                    <View className="bg-blue-500 rounded-full px-2 py-1">
                                        <Text className="text-white text-xs">1</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}