import React from 'react';
import {ScrollView, Text, TouchableOpacity, View, Image} from 'react-native';
import {Conversation} from '@/src/models/Conversation';
import {Message} from '@/src/models/Message';

interface ConversationListProps {
    conversations: Conversation[];
    selectedChat: Conversation | null;
    onSelectChat: (chat: Conversation) => void;
    participantAvatars: Record<string, string>;
    participantNames: Record<string, string>;
    userId?: string;
    formatTime: (dateString: string | undefined) => string;
    isReadByMe: (conversation: Conversation) => boolean;
    getConversationName: (conversation: Conversation) => string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    selectedChat,
    onSelectChat,
    participantAvatars,
    userId,
    formatTime,
    isReadByMe,
    getConversationName,
}) => {
    console.log('Selected chat:', selectedChat);

    const getConversationAvatar = (conversation: Conversation) => {
        if (!conversation.isGroup && conversation.participantIds.length < 3) {
            const otherParticipantId = conversation.participantIds.find((id) => id !== userId);
            return participantAvatars[otherParticipantId || ''] || conversation.avatarUrl;
        } else {
            return conversation.avatarUrl;
        }
    };

    return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            {conversations.length === 0 ? (
                <View className="p-4">
                    <Text className="text-gray-500 text-center text-sm">
                        Không có cuộc trò chuyện nào. Bắt đầu một cuộc trò chuyện mới!
                    </Text>
                </View>
            ) : (
                conversations.map((conversation) => (
                    <TouchableOpacity
                        key={conversation.id}
                        onPress={() => onSelectChat(conversation)}
                        className={`flex-row items-center px-2 py-2 rounded-lg ${
                            selectedChat?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-blue-50'
                        }`}
                    >
                        <View className="relative">
                            <Image
                                source={{uri: getConversationAvatar(conversation)}}
                                className="w-12 h-12 rounded-full border-2 border-gray-200"
                            />
                            {!conversation.isGroup && conversation.participantIds.length > 0 && (
                                <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                            )}
                        </View>

                        <View className="flex-1 ml-3 py-2">
                            <View className="flex-row items-center justify-between">
                                <Text
                                    className={`text-[15px] ${
                                        !isReadByMe(conversation) ? 'font-bold text-black' : 'font-medium text-black'
                                    }`}
                                    numberOfLines={1}
                                >
                                    {getConversationName(conversation)}
                                </Text>
                                <Text
                                    className={`text-xs ${
                                        !isReadByMe(conversation) ? 'text-[#0084FF] font-medium' : 'text-gray-500'
                                    }`}
                                >
                                    {formatTime(conversation.lastMessage?.sentAt as string)}
                                </Text>
                            </View>

                            <View className="flex-row items-center justify-between mt-0.5">
                                <Text
                                    numberOfLines={1}
                                    className={`text-sm flex-1 mr-2 ${
                                        !isReadByMe(conversation) ? 'text-black font-medium' : 'text-gray-500'
                                    }`}
                                >
                                    {conversation.lastMessage?.content || 'Bắt đầu cuộc trò chuyện'}
                                </Text>
                                {!isReadByMe(conversation) && <View className="w-3 h-3 rounded-full bg-[#0084FF]" />}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
};
