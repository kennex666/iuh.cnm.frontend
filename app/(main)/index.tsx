import React, {useEffect, useRef, useState} from 'react';
import {Linking, useWindowDimensions, View} from 'react-native';
import Conversations from '@/src/components/conversations/Conversations';
import ChatArea from '@/src/components/chat/ChatArea';
import Info from '@/src/components/info/Info';
import {Conversation} from '@/src/models/Conversation';
import { useNavigation } from 'expo-router';
import { useTabBar } from '@/src/contexts/tabbar/TabBarContext';
import { useLocalSearchParams } from 'expo-router';
import { ConversationService } from '@/src/api/services/ConversationService';
import { Message, MessageType } from '@/src/models/Message';
import SocketService from '@/src/api/services/SocketService';
import { useUser } from '@/src/contexts/user/UserContext';
import { IncomingCallModal } from '@/src/components/conversations/IncomingCallModal';
import { MessageService } from '@/src/api/services/MessageService';
import { URL_BE } from '@/src/constants/ApiConstant';

export default function MessagesScreen() {
    const params = useLocalSearchParams();
    const conversationId = params.conversationId as string | undefined;
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const {width} = useWindowDimensions();
    const isDesktop = width >= 768;
    const { hideTabBar, showTabBar } = useTabBar();
    const {user} = useUser();
    const socketService = useRef(SocketService.getInstance()).current;
    const [isComingCall, setIsComingCall] = useState(false);
    const [linkCall, setLinkCall] = useState<string | null>(null);
    const [dataCall, setDataCall] = useState<any>(null);
    const [conversationsForCall, setConversationsForCall] = useState<Conversation[]>([]);

    const handleBackPress = () => {
        if (showInfo) {
            setShowInfo(false);
            return;
        }
        setSelectedChat(null);
    };

    const handleInfoPress = () => {
        setShowInfo(true);
    };

    useEffect(() => {
        if (conversationId) {
            const fetchConversation = async () => {
                console.log('Fetching conversation with ID:', conversationId);
                const response = await ConversationService.getConversationById(conversationId);
                if (response) {
                    setSelectedChat(response.conversation);
                    
                } else {
                    console.error('Conversation not found');
                }
            };
            fetchConversation();
        }
    }, [conversationId]);

    useEffect(() => {
        if (!isDesktop && selectedChat) {
			hideTabBar();
			return () => showTabBar(); // khi unmount thì hiện lại
		}
    }, [selectedChat]);

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
                    setConversationsForCall((prev) =>
                        prev.filter((conv) => conv.id !== message.conversationId)
                    );
                    return;
                }
    
                if (message?.type == MessageType.LEFT_CONVERSATION) {
                    if (message.senderId == user?.id) {
                        setConversationsForCall((prev) =>
                            prev.filter(
                                (conv) => conv.id !== message.conversationId
                            )
                        );
                        return;
                    }
                }
            };
            socketService.onNewMessage(handleNewMessage);
            return () => {
                socketService.removeMessageListener(handleNewMessage);
            };
        }, [selectedChat, socketService, user?.id]);

    if (isDesktop) {
        return (
            <View className="flex-1 flex-row">
                {/* Left Column - Conversations List (25%) */}
                <View className="w-[25%] bg-white rounded-2xl shadow-sm overflow-hidden">
                    <Conversations selectedChat={selectedChat} onSelectChat={setSelectedChat}/>
                </View>

                {/* Middle Column - Chat Area (50%) */}
                <View className="w-[48%] mx-4 bg-white rounded-2xl shadow-sm overflow-hidden">
                    <ChatArea
                        selectedChat={selectedChat}
                        onInfoPress={handleInfoPress}
                    />
                </View>

                {/* Right Column - Info (25%) */}
                <View className="w-[25%]">
                    <View className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
                        <Info selectedChat={selectedChat}/>
                    </View>
                </View>
            </View>
        );
    }

    // Mobile layout
    return (
        <View className="flex-1 bg-white">
            {!selectedChat && (
                <View className='flex-1'>
                    <View className='h-8'></View>
                    <Conversations
                        selectedChat={selectedChat}
                        onSelectChat={setSelectedChat}
                        setConversationsForCall={setConversationsForCall}
                    />
                </View>
            )}

            {selectedChat && !showInfo && (
                <View className='flex-1'>
                    <ChatArea
                        selectedChat={selectedChat}
                        onBackPress={handleBackPress}
                        onInfoPress={handleInfoPress}
                    />
                </View>
            )}

            {selectedChat && showInfo && (
                <View className='flex-1'>
                    <View className='h-8'></View>
                    <Info
                        selectedChat={selectedChat}
                        onBackPress={handleBackPress}
                    />
                </View>
            )}
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
        </View>
    );
}