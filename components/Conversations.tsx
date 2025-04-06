import React, { Component , useState } from 'react'
import { Text, View , Image, TextInput, ScrollView, TouchableOpacity} from 'react-native'
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function Conversations() {
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedChat, setSelectedChat] = useState(1);
      const [message, setMessage] = useState('');
    
      const conversations = [
        {
          id: 1,
          name: 'Le Nguyen Duy Khang',
          lastMessage: 'ok ok',
          time: '05:41',
          unread: 0,
          avatar: 'https://placehold.co/48x48/random/FFFFFF/png?text=LK',
          isGroup: false,
          isOnline: true
        },
        {
          id: 2,
          name: '420300154902_17B_HK2_20242025',
          lastMessage: 'Có gì link Drive: 1. Slides & books: https://drive.google...',
          time: '11:35',
          unread: 2,
          avatar: 'https://placehold.co/48x48/0068FF/FFFFFF/png?text=G',
          isGroup: true,
          members: '81 thành viên'
        }
      ];
    
      const messages = [
        {
          id: 1,
          sender: 'Le Nguyen Duy Khang',
          content: '50',
          time: '05:42',
          reactions: ['😆', '😭'],
          isSent: true
        },
        {
          id: 2,
          sender: 'You',
          content: 'ok ok',
          time: '05:41',
          isSent: true
        },
        {
          id: 3,
          sender: 'You',
          content: 'ngủ hơi sâu',
          time: '05:41',
          isSent: true
        }
      ];
    
      const selectedConversation = conversations.find(c => c.id === selectedChat);
    
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
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              className={`flex-row items-center px-4 py-3 ${
                selectedChat === conversation.id ? 'bg-blue-50' : ''
              }`}
              onPress={() => setSelectedChat(conversation.id)}
              activeOpacity={0.7}
            >
              <View className="relative">
                <Image
                  source={{ uri: conversation.avatar }}
                  className="w-12 h-12 rounded-full bg-gray-100"
                />
                {conversation.isOnline && (
                  <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
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
    )
}
