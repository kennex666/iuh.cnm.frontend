import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Conversations from '@/components/Conversations';
import ChatArea from '@/components/ChatArea';
import Info from '@/components/Info';

export default function MessagesScreen() {
  // slectedChat state to manage the currently selected chat
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  return (
    <View className="flex-1 bg-white flex-row">
      {/* Left Column - Conversations List */}
      <Conversations selectedChat={selectedChat} onSelectChat={setSelectedChat} />

      {/* Middle Column - Chat Area */}
      <ChatArea selectedChat={selectedChat} />

      {/* Right Column - Info */}
      <Info />
    </View>
  );
}