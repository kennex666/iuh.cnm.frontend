import React, { useState } from 'react';
import { Text, View, Image, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConversations } from '@/hooks/useConversations';

export default function Conversations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { conversations, loading, error } = useConversations();

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    const searchLower = searchQuery.toLowerCase();
    return conversation.name?.toLowerCase().includes(searchLower) ||
           conversation.lastMessage.content.toLowerCase().includes(searchLower);
  });

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View className="w-[23vw] border-r border-gray-200 items-center justify-center">
        <ActivityIndicator size="large" color="#0068FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="w-[23vw] border-r border-gray-200 items-center justify-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  return (
    <View className="w-[23vw] border-r border-gray-200">
      {/* Search Header */}
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 h-9">
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
        {filteredConversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            className={`flex-row items-center px-4 py-3 ${
              selectedChat === conversation.id ? 'bg-blue-50' : ''
            }`}
            onPress={() => {
              setSelectedChat(conversation.id)
              console.log(conversation.id)
            }}
            activeOpacity={0.7}
          >
            <View className="relative">
              <Image
                source={{ uri: conversation.avatarUrl || 'https://placehold.co/48x48/0068FF/FFFFFF/png?text=G' }}
                className="w-12 h-12 rounded-full bg-gray-100"
              />
              {!conversation.isGroup && (
                <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </View>
            <View className="flex-1 ml-3">
              <View className="flex-row items-center justify-between">
                <Text className="font-medium text-gray-900">
                  {conversation.name || conversation.participantIds.join(', ')}
                </Text>
                <Text className="text-xs text-gray-500">
                  {formatTime(conversation.lastMessage.sentAt)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-sm text-gray-500 flex-1 mr-2" numberOfLines={1}>
                  {conversation.lastMessage.content}
                </Text>
                {conversation.lastMessage.readBy.length === 0 && (
                  <View className="bg-blue-500 rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-white text-xs">1</Text>
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
