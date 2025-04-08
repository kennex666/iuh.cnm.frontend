import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Conversation } from '../hooks/useConversations';

interface InfoProps {
  selectedChat: Conversation | null;
}

export default function Info({ selectedChat }: InfoProps) {
  if (!selectedChat) {
    return (
      <View className="flex-1 items-center justify-center border-l border-gray-200">
        <Text className="text-gray-500">Chọn một cuộc trò chuyện để xem thông tin</Text>
      </View>
    );
  }

  // Hiển thị giao diện cho người dùng
  if (!selectedChat.isGroup) {
    return (
      <ScrollView className="flex-1 bg-white border-l border-gray-200">
        {/* Header title */}
        <View className="h-14 px-4 border-b border-gray-200 flex-row items-center">
          <Text className="text-lg font-semibold text-gray-900">Thông tin người dùng</Text>
        </View>

        {/* Header với avatar và tên */}
        <View className="items-center pt-8 pb-6 border-b border-gray-100">
          <Image
            source={{ uri: selectedChat.avatarUrl || 'https://placehold.co/96x96/0068FF/FFFFFF/png' }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-xl font-semibold text-gray-900">{selectedChat.name || 'Chưa có tên'}</Text>
          <Text className="text-sm text-gray-500 mt-1">{selectedChat.participantIds[0] || 'null'}</Text>
        </View>

        {/* Actions */}
        <View className="flex-row justify-around py-4 border-b border-gray-100">
          <TouchableOpacity className="items-center">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
              <Ionicons name="person-outline" size={20} color="#666" />
            </View>
            <Text className="text-sm text-gray-600">Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
              <Ionicons name="notifications-off-outline" size={20} color="#666" />
            </View>
            <Text className="text-sm text-gray-600">Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
              <Ionicons name="search-outline" size={20} color="#666" />
            </View>
            <Text className="text-sm text-gray-600">Search</Text>
          </TouchableOpacity>
        </View>

        {/* Media Section */}
        <View className="p-4 border-b border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-medium">Ảnh/Video</Text>
            <TouchableOpacity>
              <Text className="text-blue-500">Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap">
            {[1, 2, 3, 4].map((item) => (
              <View key={item} className="w-[48%] aspect-square bg-gray-100 rounded-lg m-1" />
            ))}
          </View>
        </View>

        {/* Files Section */}
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-medium">File</Text>
            <TouchableOpacity>
              <Text className="text-blue-500">Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-gray-50 p-3 rounded-lg flex-row items-center mb-2">
            <Ionicons name="document-outline" size={24} color="#666" />
            <View className="ml-3">
              <Text className="text-gray-900">Document.pdf</Text>
              <Text className="text-gray-500 text-sm">123 KB</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Hiển thị giao diện cho nhóm
  return (
    <ScrollView className="flex-1 bg-white border-l border-gray-200">
      {/* Header title */}
      <View className="h-14 px-4 border-b border-gray-200 flex-row items-center">
        <Text className="text-lg font-semibold text-gray-900">Thông tin nhóm</Text>
      </View>

      {/* Header với avatar và tên nhóm */}
      <View className="items-center pt-8 pb-6 border-b border-gray-100">
        <Image
          source={{ uri: selectedChat.avatarUrl || 'https://placehold.co/96x96/0068FF/FFFFFF/png' }}
          className="w-24 h-24 rounded-full mb-4"
        />
        <Text className="text-xl font-semibold text-gray-900">{selectedChat.name || 'Chưa có tên'}</Text>
        <Text className="text-sm text-gray-500 mt-1">{selectedChat.participantIds.length} thành viên</Text>
      </View>

      {/* Actions */}
      <View className="flex-row justify-between py-4 px-8 border-b border-gray-100">
        <View className="flex-row space-x-8">
          <TouchableOpacity className="items-center">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
              <Ionicons name="notifications-off-outline" size={20} color="#666" />
            </View>
            <Text className="text-sm text-gray-600">Mute</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
              <Ionicons name="search-outline" size={20} color="#666" />
            </View>
            <Text className="text-sm text-gray-600">Search</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="items-center">
          <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
            <Ionicons name="flag-outline" size={20} color="#666" />
          </View>
          <Text className="text-sm text-gray-600">Báo cáo</Text>
        </TouchableOpacity>
      </View>

      {/* Media Section */}
      <View className="p-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-base font-medium">Ảnh/Video</Text>
          <TouchableOpacity>
            <Text className="text-blue-500">Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row flex-wrap">
          {[1, 2, 3, 4].map((item) => (
            <View key={item} className="w-[48%] aspect-square bg-gray-100 rounded-lg m-1" />
          ))}
        </View>
      </View>

      {/* Files Section */}
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-base font-medium">File</Text>
          <TouchableOpacity>
            <Text className="text-blue-500">Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-gray-50 p-3 rounded-lg flex-row items-center mb-2">
          <Ionicons name="document-outline" size={24} color="#666" />
          <View className="ml-3">
            <Text className="text-gray-900">Document.pdf</Text>
            <Text className="text-gray-500 text-sm">123 KB</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}