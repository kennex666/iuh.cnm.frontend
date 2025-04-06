import React, { Component, useState } from 'react'
import { Text, View, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function Info() {
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
    <View className="w-[23vw] border-l border-gray-200">
      <View className="p-6">
        {selectedConversation ? (
          <>
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
                  {/* <Ionicons name="notifications-outline" size={20} color="#666" /> */}
                  <Ionicons name="person-circle-outline" size={20} color="#666" />
                </View>
                <Text className="text-xs text-gray-600">Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                  <Ionicons name="notifications" size={20} color="#666" />
                </View>
                <Text className="text-xs text-gray-600">Mute</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-1">
                  <Ionicons name="search" size={20} color="#666" />
                </View>
                <Text className="text-xs text-gray-600">Search</Text>
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
          </>
        ) : (
          <Text className="text-center text-gray-500">Không có cuộc trò chuyện nào được chọn</Text>
        )}
      </View>
    </View>
  )
}
