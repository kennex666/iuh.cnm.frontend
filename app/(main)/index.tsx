import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Conversations from '@/components/Conversations';
import ChatArea from '@/components/ChatArea';
import Info from '@/components/Info';
import { Conversation } from '@/hooks/useConversations';

export default function MessagesScreen() {
  // slectedChat state to manage the currently selected chat
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);

  return (
    <View className="flex-1 bg-white flex-row">
      {/* Left Column - Conversations List (25%) */}
      <View className="w-1/4">
        <Conversations selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      </View>

      {/* Middle Column - Chat Area (50%) */}
      <View className="w-1/2">
        <ChatArea selectedChat={selectedChat} />
      </View>

      {/* Right Column - Info (25%) */}
      <View className="w-1/4">
        <Info selectedChat={selectedChat} />
      </View>
    </View>
  );
}