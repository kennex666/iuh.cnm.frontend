import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Linking, Platform, Text, View} from 'react-native';
import {ConversationService} from '@/src/api/services/ConversationService';
import {Conversation} from "@/src/models/Conversation";
import {useUser} from '@/src/contexts/user/UserContext';
import {UserService} from '@/src/api/services/UserService';
import SocketService from '@/src/api/services/SocketService';
import {Message, MessageType} from '@/src/models/Message';
import {useFocusEffect} from 'expo-router';
import {MessageService} from '@/src/api/services/MessageService';
import {ConversationList} from './ConversationList';
import {IncomingCallModal} from './IncomingCallModal';
import {SearchBar} from './SearchBar';
import {QRScannerModal} from './QRScannerModal';
import { URL_BE } from '@/src/constants/ApiConstant';

interface ConversationsProps {
    selectedChat: Conversation | null;
    onSelectChat: (chat: Conversation) => void;
    newSelectedChat?: Conversation | null;
    setConversationsForCall?: (conversations: Conversation[]) => void;
}

export default function Conversations({selectedChat, onSelectChat,setConversationsForCall, newSelectedChat}: ConversationsProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useUser();
    const [participantAvatars, setParticipantAvatars] = useState<Record<string, string>>({});
    const [participantNames, setParticipantNames] = useState<Record<string, string>>({});
    const socketService = useRef(SocketService.getInstance()).current;
    const [isComingCall, setIsComingCall] = useState(false);
    const [linkCall, setLinkCall] = useState<string | null>(null);
    const [dataCall, setDataCall] = useState<any>(null);
    const [showQRScanner, setShowQRScanner] = useState(false);

    // Fetch conversations
    const fetchConversations = async () => {
        try {
            const response = await ConversationService.getConversations();
            if (response.success) {
                setConversations(response.conversations);
                setConversationsForCall?.(response.conversations);

                // Fetch avatars for all participants
                const uniqueParticipantIds = new Set<string>();
                response.conversations.forEach((conv) => {
                    conv.participantIds.forEach((id) =>
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

    useFocusEffect(
        useCallback(() => {
            fetchConversations();
        }, [user?.id, showQRScanner])
    );


    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            if (message?.type == MessageType.CALL) {
                console.log("Incoming call message: ", message);
                if (message.content == 'start') {
                    if (message.senderId === user?.id) {
                        setLinkCall("");
                        setIsComingCall(false);
                        setDataCall(null);
                        // Open the call in browser (on React Native)\
                        Linking.openURL(`${URL_BE}/webrtc/call/${message.conversationId}/${user?.id}/${message.id}`);
                        return;
                    }
                    setLinkCall(
						`${URL_BE}/webrtc/call/${message.conversationId}/${user?.id}/${message.id}`
					);
                    setIsComingCall(true);
                    setDataCall(message);
                } else {
                    setLinkCall("");
                    setIsComingCall(false);
                    setDataCall(null);
                }
            }

            if (message?.type == ("deleted_conversation" as any)) {
				setConversations((prev) =>
					prev.filter((conv) => conv.id !== message.conversationId)
				);
				return;
			}

            if (message?.type == MessageType.LEFT_CONVERSATION) {
				if (message.senderId == user?.id) {
					setConversations((prev) =>
						prev.filter(
							(conv) => conv.id !== message.conversationId
						)
					);
					return;
				}
			}
            conversations.forEach((conversation) => {
                if (conversation.id === message.conversationId) {
                    const updatedConversation = {
                        ...conversation,
                        lastMessage: {
                            ...message,
                            readBy: (selectedChat?.id == conversation.id)
                                ? [...(message.readBy || []), user?.id] : message.readBy || [],
                        } as Message,
                    };
                    setConversations((prev) =>
                        prev
                            .map((conv) =>
                                conv.id === conversation.id
                                    ? updatedConversation
                                    : conv
                            )
                            .sort((a, b) => {
                                if (a.lastMessage && b.lastMessage) {
                                    return (
                                        new Date(
                                            b.lastMessage.sentAt
                                        ).getTime() -
                                        new Date(
                                            a.lastMessage.sentAt
                                        ).getTime()
                                    );
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
    }, [conversations, socketService, user?.id]);

    // Update readBy field when conversation is selected
    useEffect(() => {
        setConversations((prev) =>
            prev.map((conv) => {
                if (conv.id == selectedChat?.id) {
                    return {
                        ...conv,
                        lastMessage: {
                            ...conv.lastMessage,
                            readBy: conv.lastMessage?.readBy
                                ? [...conv.lastMessage.readBy, user?.id]
                                : [user?.id],
                        } as Message,
                    };
                }
                return conv;
            })
        );
    }, [selectedChat?.id, socketService, user?.id]);

    const formatTime = (dateString: string | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    const isReadByMe = (conversation: Conversation) => {
        if (selectedChat?.id && selectedChat.id == conversation.id) {
            return true;
        }
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
            const otherParticipants = conversation.participantIds
                .filter(id => id !== user?.id)
                .slice(0, 2);
            const names = otherParticipants.map(id => participantNames[id] || 'Unknown');
            return names.join(', ');
        }

        const otherParticipantId = conversation.participantIds.find(id => id !== user?.id);
        return otherParticipantId ? participantNames[otherParticipantId] || 'Unknown' : 'Unknown';
    };

    
    // Socket listeners
    useEffect(() => {
        const handleAddParticipant = (updatedConversation: Conversation) => {
            fetchConversations();
        };
        function handleRemoveParticipant(data: { conversationId: string; removedParticipants: string[]; }) {
            setConversations((prev) =>
                prev.filter((conv) => conv.id != data.conversationId)
            );
            fetchConversations();
            console.log("Conversation removed: 11", data.conversationId);
        }
        socketService.onParticipantsAddedServer(handleAddParticipant);
        socketService.onParticipantsRemovedServer(handleRemoveParticipant);
        return () => {
            socketService.removeParticipantsAddedServer(handleAddParticipant);
            socketService.removeParticipantsRemovedServer(handleRemoveParticipant);
        };
    }, [socketService]);

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
        <View className="flex-1 px-2">
            {
            Platform.OS === 'web' && (
                <IncomingCallModal
                    isVisible={isComingCall && !!linkCall}
                    linkCall={linkCall || ''}
                    onAccept={() => {
                        setIsComingCall(false);
                    }}
                    onDecline={() => {
                        setIsComingCall(false);
                        MessageService.rejectCall(dataCall.conversationId);
                    }}
                /> 
            )}

            <SearchBar
                showQRScanner={showQRScanner}
                setShowQRScanner={setShowQRScanner}
            />

            <ConversationList
                conversations={conversations}
                selectedChat={selectedChat}
                onSelectChat={onSelectChat}
                participantAvatars={participantAvatars}
                participantNames={participantNames}
                userId={user?.id}
                formatTime={formatTime}
                isReadByMe={isReadByMe}
                getConversationName={getConversationName}
            />

            <QRScannerModal
                showQRScanner={showQRScanner}
                setShowQRScanner={setShowQRScanner}
            />
        </View>
    );
}