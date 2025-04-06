import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function MessagesScreen() {
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
    <View className="flex-1 bg-white flex-row">
      {/* Left Column - Conversations List */}
      <View className="w-80 border-r border-gray-200">
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

      {/* Middle Column - Chat Area */}
      <View className="flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <View className="h-16 px-4 border-b border-gray-200 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: selectedConversation.avatar }}
                  className="w-10 h-10 rounded-full"
                />
                <View className="ml-3">
                  <Text className="font-semibold text-gray-900">
                    {selectedConversation.name}
                  </Text>
                  {selectedConversation.isGroup && (
                    <Text className="text-sm text-gray-500">
                      {selectedConversation.members}
                    </Text>
                  )}
                </View>
              </View>
              <View className="flex-row items-center space-x-4">
                <TouchableOpacity>
                  <Ionicons name="call-outline" size={22} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="videocam-outline" size={22} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="information-circle-outline" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages Area */}
            <ScrollView className="flex-1 p-4">
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  className={`flex-row items-end mb-4 ${
                    msg.sender === 'You' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender !== 'You' && (
                    <Image
                      source={{ uri: selectedConversation.avatar }}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <View>
                    <View
                      className={`rounded-2xl px-4 py-2 max-w-[70%] ${
                        msg.sender === 'You' ? 'bg-blue-500' : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        className={msg.sender === 'You' ? 'text-white' : 'text-gray-900'}
                      >
                        {msg.content}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-xs text-gray-500 ml-2">{msg.time}</Text>
                      {msg.reactions?.map((reaction, index) => (
                        <Text key={index} className="ml-1">{reaction}</Text>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Input Area */}
            <View className="border-t border-gray-200 p-4">
              <View className="flex-row items-center">
                <TouchableOpacity className="p-2">
                  <Ionicons name="add-circle-outline" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2">
                  <Ionicons name="image-outline" size={24} color="#666" />
                </TouchableOpacity>
                <View className="flex-1 bg-gray-100 rounded-full mx-2 px-4 py-2">
                  <TextInput
                    className="flex-1 text-base text-gray-800"
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    placeholderTextColor="#666"
                  />
                </View>
                <TouchableOpacity className="p-2">
                  <Ionicons name="happy-outline" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity className="p-2">
                  <Ionicons name="send" size={24} color="#0068FF" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</Text>
          </View>
        )}
      </View>

      {/* Right Column - Conversation Info */}
      {selectedConversation && (
        <View className="w-80 border-l border-gray-200">
          <View className="p-6">
            <View className="items-center">
              <Image
                source={{ uri: selectedConversation.avatar }}
                className="w-20 h-20 rounded-full"
              />
              <Text className="mt-4 text-xl font-semibold text-gray-900">
                {selectedConversation.name}
              </Text>
              {selectedConversation.isGroup && (
                <Text className="mt-1 text-sm text-gray-500">
                  {selectedConversation.members}
                </Text>
              )}
            </View>

            <View className="flex-row justify-around mt-6">
              <TouchableOpacity className="items-center">
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                  <Ionicons name="notifications-outline" size={20} color="#666" />
                </View>
                <Text className="text-xs text-gray-600">Tắt thông báo</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                  <Ionicons name="search-outline" size={20} color="#666" />
                </View>
                <Text className="text-xs text-gray-600">Tìm tin nhắn</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                  <Ionicons name="people-outline" size={20} color="#666" />
                </View>
                <Text className="text-xs text-gray-600">Thành viên</Text>
              </TouchableOpacity>
            </View>

            {/* Media Section */}
            <View className="mt-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-medium text-gray-900">Ảnh/Video</Text>
                <TouchableOpacity>
                  <Text className="text-sm text-blue-500">Xem tất cả</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-wrap -mx-1">
                {[1, 2, 3, 4].map((item) => (
                  <View key={item} className="w-1/2 p-1">
                    <View className="aspect-square bg-gray-100 rounded-lg" />
                  </View>
                ))}
              </View>
            </View>

            {/* Files Section */}
            <View className="mt-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="font-medium text-gray-900">File</Text>
                <TouchableOpacity>
                  <Text className="text-sm text-blue-500">Xem tất cả</Text>
                </TouchableOpacity>
              </View>
              <View className="bg-gray-50 rounded-lg p-3">
                <View className="flex-row items-center">
                  <Ionicons name="document-outline" size={24} color="#666" />
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-medium text-gray-900">Document.pdf</Text>
                    <Text className="text-xs text-gray-500">123 KB</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}