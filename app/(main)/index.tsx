import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Conversations from '@/components/Conversations';
import ChatArea from '@/components/ChatArea';
import Info from '@/components/Info';

// Services
import { getUsers } from '@/constants/api/services/userService';


export default function MessagesScreen() {
  return (
    <View className="flex-1 bg-white flex-row">
      {/* Left Column - Conversations List */}
      <Conversations></Conversations>

      {/* Middle Column - Chat Area */}
      <ChatArea></ChatArea>

      {/* Right Column - Info */}
      <Info />
    </View>
  );
}