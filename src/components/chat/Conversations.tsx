import React, { useCallback, useEffect, useRef, useState } from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import { ConversationService } from '@/src/api/services/ConversationService';
import {Conversation} from "@/src/models/Conversation";
import { useAuth } from '@/src/contexts/UserContext';
import { UserService } from '@/src/api/services/UserService';
import SocketService from '@/src/api/services/SocketService';
import { Message } from '@/src/models/Message';
import { useFocusEffect } from 'expo-router';

interface ConversationsProps {
    selectedChat: Conversation | null;
    onSelectChat: (chat: Conversation) => void;
}

export default function Conversations({selectedChat, onSelectChat}: ConversationsProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [participantAvatars, setParticipantAvatars] = useState<Record<string, string>>({});
    const [participantNames, setParticipantNames] = useState<Record<string, string>>({});
    const socketService = useRef(SocketService.getInstance()).current;

    // Fetch conversations
    useFocusEffect(
        useCallback(() => {
            console.log("Fetching conversations...");
            const fetchConversations = async () => {
                try {
                    const response = await ConversationService.getConversations();
                    if (response.success) {
                        setConversations(response.conversations);

                        // Fetch avatars for all participants
                        const uniqueParticipantIds = new Set<string>();
                        response.conversations.forEach((conv) => {
                            conv.participants.forEach((id) =>
                                uniqueParticipantIds.add(id)
                            );
                        });

                        const avatars: Record<string, string> = {};
                        for (const participantId of uniqueParticipantIds) {
                            if (participantId !== user?.id) {
                                const userResponse = await UserService.getUserById(
                                    participantId
                                );
                                if (userResponse.success && userResponse.user) {
                                    avatars[participantId] =
                                        userResponse.user.avatarURL;
                                    participantNames[participantId] =
                                        userResponse.user.name;
                                }
                            }
                        }
                        setParticipantAvatars(avatars);
                        setParticipantNames(participantNames);
                    } else {
                        setError(
                            response.message || "Failed to fetch conversations"
                        );
                    }
                } catch (error) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "An unknown error occurred"
                    );
                } finally {
                    console.log("Conversations fetched");
                    setLoading(false);
                }
            };

            fetchConversations();
        }, [user?.id])
    )

    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            conversations.forEach((conversation) => {
                if (conversation.id === message.conversationId) {
                    const updatedConversation = {
                        ...conversation,
                        lastMessage: message,
                    };
                    setConversations((prev) =>
                        prev.map((conv) => (conv.id === conversation.id ? updatedConversation : conv)).sort((a, b) => {
                            if (a.lastMessage && b.lastMessage) {
                                return new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime();
                            } else if (a.lastMessage) {
                                return -1;
                            }
                            return 0;
                        })
                    );
                }
            });
        };
        socketService.onNewMessage(handleNewMessage);
        return () => {
            socketService.removeMessageListener(handleNewMessage);
        };
    }, [selectedChat?.id]);

    const formatTime = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    const isReadByMe = (conversation: Conversation) => {
        if (conversation.lastMessage && conversation.lastMessage.readBy) {
            return conversation.lastMessage.readBy.includes(user?.id || '');
        }
        return false;
    }

    const getConversationName = (conversation: Conversation) => {
        if (conversation.name) {
            return conversation.name;
        }
        
        if (conversation.isGroup) {
            // Lấy tên của 2 người đầu tiên trong nhóm
            const otherParticipants = conversation.participants
                .filter(id => id !== user?.id)
                .slice(0, 2);
            const names = otherParticipants.map(id => participantNames[id] || 'Unknown');
            return names.join(', ');
        }
        
        // Trong chat riêng tư, lấy tên của người còn lại
        const otherParticipantId = conversation.participants.find(id => id !== user?.id);
        return otherParticipantId ? participantNames[otherParticipantId] || 'Unknown' : 'Unknown';
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
					<Ionicons name="search-outline" size={20} color="#666" />
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
							selectedChat?.id === conversation.id
								? "bg-blue-50"
								: ""
						}`}
						onPress={() => {
							onSelectChat(conversation);
						}}
					>
						<View className="relative">
							<Image
								source={{
									uri:
										!conversation.isGroup &&
										conversation.participants.length < 3
											? participantAvatars[
													conversation.participants.find(
														(id) => id !== user?.id
													) || ""
											  ] || conversation.avatar
											: conversation.avatar,
									headers: {
										Accept: "image/*",
									},
									cache: "force-cache",
								}}
								className="w-12 h-12 rounded-full"
							/>
							{!conversation.isGroup &&
								conversation.participants.length > 0 && (
									<View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
								)}
						</View>
						<View className="flex-1 ml-3">
							<View className="flex-row justify-between items-center">
								<Text className="font-semibold text-gray-900">
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
		</View>
	);
}