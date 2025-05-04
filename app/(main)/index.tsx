import React, {useEffect, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import Conversations from '@/src/components/conversations/Conversations';
import ChatArea from '@/src/components/chat/ChatArea';
import Info from '@/src/components/chat/Info';
import {Conversation} from '@/src/models/Conversation';
import { useNavigation } from 'expo-router';
import { useTabBar } from '@/src/contexts/tabbar/TabBarContext';

export default function MessagesScreen() {
    // slectedChat state to manage the currently selected chat
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const {width} = useWindowDimensions();
    const isDesktop = width >= 768;
    const { hideTabBar, showTabBar } = useTabBar();

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
        </View>
    );
}