import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { Conversation } from "@/src/models/Conversation";
import { Message } from '@/src/models/Message';

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
    getConversationName
}) => {
    return (
        <ScrollView className="flex-1">
            {conversations.map((conversation) => (
                <TouchableOpacity
                    key={conversation.id}
                    className={`flex-row items-center p-4 rounded-xl ${
                        selectedChat?.id === conversation.id
                            ? "bg-blue-50"
                            : ""
                    }`}
                    onPress={() => {
                        onSelectChat(conversation);
                        console.log("Selected chat: ", conversation);
                    }}
                >
                    <View className="relative">
                        <Image
                            source={{
                                uri:
                                    !conversation.isGroup &&
                                    conversation.participantIds.length < 3
                                        ? participantAvatars[
                                                conversation.participantIds.find(
                                                    (id) => id !== userId
                                                ) || ""
                                            ] || conversation.avatarUrl
                                        : conversation.avatarUrl,
                                headers: {
                                    Accept: "image/*",
                                },
                                cache: "force-cache",
                            }}
                            className="w-12 h-12 rounded-full"
                        />
                        {!conversation.isGroup &&
                            conversation.participantIds.length > 0 && (
                                <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            )}
                    </View>
                    <View className="flex-1 ml-3">
                        <View className="flex-row justify-between items-center">
                            <Text className="font-semibold text-gray-900 text-base">
                                {getConversationName(conversation)}
                            </Text>
                            {conversation.lastMessage?.sentAt && (
                                <Text
                                    className={
                                        isReadByMe(conversation)
                                            ? "text-xs text-gray-500"
                                            : "text-xs font-semibold text-gray-500"
                                    }
                                >
                                    {formatTime(
                                        conversation.lastMessage
                                            .sentAt as string
                                    )}
                                </Text>
                            )}
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text
                                className={
                                    isReadByMe(conversation)
                                        ? "text-sm text-gray-500 flex-1 mr-2"
                                        : "text-sm text-gray-500 font-bold flex-1 mr-2"
                                }
                                numberOfLines={1}
                            >
                                {conversation.lastMessage?.content ||
                                    "No messages yet"}
                            </Text>
                            {!isReadByMe(conversation) && (
                                <View className="bg-blue-500 rounded-full p-1">
                                    {/* <Text className="text-white text-xs">1</Text> */}
                                </View>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}; 