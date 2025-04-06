import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      name: '420300154902_17B_HK2_20242025',
      lastMessage: 'Có gì link Drive: 1. Slides & books: https://drive.google.com/drive/folders/1-lFmJ4_rfhQG8U4c...',
      time: '11:35',
      unread: 2,
      avatar: 'https://placehold.co/48x48/0068FF/FFFFFF/png?text=G',
      isGroup: true
    },
    {
      id: 2,
      name: 'Hạ Thị Kim Thoa',
      lastMessage: 'Em đã gửi bài tập rồi ạ',
      time: '10:20',
      unread: 0,
      avatar: 'https://placehold.co/48x48/random/FFFFFF/png?text=HT',
      isGroup: false
    },
    {
      id: 3,
      name: 'Thangdhcn',
      lastMessage: 'xác nhận nộp bài và số KB',
      time: '09:15',
      unread: 0,
      avatar: 'https://placehold.co/48x48/random/FFFFFF/png?text=T',
      isGroup: false
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1">
        {/* Header */}
        <View className="h-14 px-4 border-b border-gray-100 flex-row items-center justify-between">
          <Text className="text-xl font-semibold">Tin nhắn</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-2">
          <View className="flex-row items-center bg-gray-100 rounded-lg px-3 h-10">
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base text-gray-800"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />
          </View>
        </View>

        {/* Conversations List */}
        <ScrollView className="flex-1">
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              className="flex-row items-center px-4 py-3 border-b border-gray-100 active:bg-gray-50"
              activeOpacity={0.7}
            >
              <View className="relative">
                <Image
                  source={{ uri: conversation.avatar }}
                  className="w-12 h-12 rounded-full bg-gray-100"
                />
                {conversation.isGroup && (
                  <View className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Ionicons name="people" size={12} color="white" />
                  </View>
                )}
              </View>
              <View className="flex-1 ml-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-900">{conversation.name}</Text>
                  <Text className="text-xs text-gray-500">{conversation.time}</Text>
                </View>
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-sm text-gray-500 flex-1 mr-2" numberOfLines={1}>
                    {conversation.lastMessage}
                  </Text>
                  {conversation.unread > 0 && (
                    <View className="bg-blue-500 rounded-full w-5 h-5 items-center justify-center">
                      <Text className="text-white text-xs">{conversation.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
} 