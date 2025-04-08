import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Conversation } from '../hooks/useConversations';

interface InfoProps {
  selectedChat: Conversation | null;
}

export default function Info({ selectedChat }: InfoProps) {
  if (!selectedChat) {
    return (
      <View className="flex-1 border-l border-gray-200 items-center justify-center">
        <Text className="text-gray-500">Chọn một cuộc trò chuyện để xem thông tin</Text>
      </View>
    );
  }

  if (selectedChat.isGroup) {
    return (
      <View className="flex-1 border-l border-gray-200">
        {/* Info Header */}
        <View className="h-16 px-4 border-b border-gray-200 flex-row items-center justify-between">
          <Text className="font-semibold text-gray-900">Thông tin cuộc trò chuyện</Text>
          <Ionicons name="close-outline" size={24} color="#666" />
        </View>

        {/* Info Content */}
        <ScrollView className="flex-1 p-4">
          {/* Members Section */}
          <View className="mb-6">
            <Text className="font-semibold text-gray-900 mb-2">Thành viên</Text>
            <View className="flex-row items-center mb-2">
              <Image
                source={{ uri: selectedChat.avatarUrl || 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=G' }}
                className="w-10 h-10 rounded-full"
              />
              <View className="ml-3">
                <Text className="font-medium text-gray-900">{selectedChat.name || 'Group Chat'}</Text>
                <Text className="text-sm text-gray-500">{selectedChat.participantIds.length} thành viên</Text>
              </View>
            </View>
          </View>

          {/* Media Section */}
          <View className="mb-6">
            <Text className="font-semibold text-gray-900 mb-2">Media, files và links</Text>
            <View className="flex-row space-x-4">
              <View className="flex-1 items-center">
                <Ionicons name="image-outline" size={24} color="#666" />
                <Text className="text-sm text-gray-500 mt-1">Media</Text>
              </View>
              <View className="flex-1 items-center">
                <Ionicons name="document-outline" size={24} color="#666" />
                <Text className="text-sm text-gray-500 mt-1">Files</Text>
              </View>
              <View className="flex-1 items-center">
                <Ionicons name="link-outline" size={24} color="#666" />
                <Text className="text-sm text-gray-500 mt-1">Links</Text>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View>
            <Text className="font-semibold text-gray-900 mb-2">Cài đặt</Text>
            <View className="space-y-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">Thông báo</Text>
                <Ionicons name="notifications-outline" size={24} color="#666" />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">Tìm kiếm</Text>
                <Ionicons name="search-outline" size={24} color="#666" />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-700">Báo cáo</Text>
                <Ionicons name="flag-outline" size={24} color="#666" />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Individual chat interface
  return (
    <View className="flex-1 border-l border-gray-200">
      <View className="p-6">
        <View className="items-center">
          <Image
            source={{ uri: selectedChat.avatarUrl || 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=U' }}
            className="w-20 h-20 rounded-full"
          />
          <Text className="mt-4 text-xl font-semibold text-gray-900">
            {selectedChat.name || selectedChat.participantIds.join(', ')}
          </Text>
        </View>

        <View className="flex-row justify-around mt-6">
          <TouchableOpacity className="items-center">
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-1">
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
      </View>
    </View>
  );
}