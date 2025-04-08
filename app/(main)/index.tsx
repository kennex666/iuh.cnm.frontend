import React, {useState} from 'react';
import {View} from 'react-native';
import Conversations from '@/src/components/chat/Conversations';
import ChatArea from '@/src/components/chat/ChatArea';
import Info from '@/src/components/chat/Info';
import {Conversation} from '@/src/hook/useConversations';

export default function MessagesScreen() {
    // slectedChat state to manage the currently selected chat
    const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);

    return (
        <View className="flex-1 bg-white flex-row">
            {/* Left Column - Conversations List (25%) */}
            <View className="w-1/4">
                <Conversations selectedChat={selectedChat} onSelectChat={setSelectedChat}/>
            </View>

            {/* Middle Column - Chat Area (50%) */}
            <View className="w-1/2">
                <ChatArea selectedChat={selectedChat}/>
            </View>

            {/* Right Column - Info (25%) */}
            <View className="w-1/4">
                <Info selectedChat={selectedChat}/>
            </View>
        </View>
    );
}