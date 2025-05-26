import React, {useEffect, useState, useRef} from 'react';
import {useWindowDimensions, View} from 'react-native';
import Conversations from '@/src/components/conversations/Conversations';
import ChatArea from '@/src/components/chat/ChatArea';
import Info from '@/src/components/info/Info';
import {Conversation} from '@/src/models/Conversation';
import { useNavigation } from 'expo-router';
import { useTabBar } from '@/src/contexts/tabbar/TabBarContext';
import { useLocalSearchParams } from 'expo-router';
import { ConversationService } from '@/src/api/services/ConversationService';

export default function MessagesScreen() {
    const params = useLocalSearchParams();
    const conversationId = params.conversationId as string | undefined;
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const {width} = useWindowDimensions();
    const isDesktop = width >= 768;
    const { hideTabBar, showTabBar } = useTabBar();
    
    // New ref for scrolling to messages
    const messageScrollRef = useRef<{ scrollToMessage?: (messageId: string) => void }>({}); 

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
    
    // New function to handle scrolling to a message
    const handleScrollToMessage = (messageId: string) => {
        if (messageScrollRef.current.scrollToMessage) {
            messageScrollRef.current.scrollToMessage(messageId);
        }
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
                        scrollRef={messageScrollRef}
                    />
                </View>

                {/* Right Column - Info (25%) */}
                <View className="w-[25%]">
                    <View className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
                        <Info 
                            selectedChat={selectedChat}
                            onScrollToMessage={handleScrollToMessage}
                        />
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
                    />
                </View>
            )}

            {selectedChat && !showInfo && (
                <View className='flex-1'>
                    <ChatArea
                        selectedChat={selectedChat}
                        onBackPress={handleBackPress}
                        onInfoPress={handleInfoPress}
                        scrollRef={messageScrollRef}
                    />
                </View>
            )}

            {selectedChat && showInfo && (
                <View className='flex-1'>
                    <View className='h-8'></View>
                    <Info
                        selectedChat={selectedChat}
                        onBackPress={handleBackPress}
                        onScrollToMessage={handleScrollToMessage}
                    />
                </View>
            )}
        </View>
    );
}