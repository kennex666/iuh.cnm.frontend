import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Info() {
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
              source={{ uri: 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=G' }}
              className="w-10 h-10 rounded-full"
            />
            <View className="ml-3">
              <Text className="font-medium text-gray-900">Group Chat</Text>
              <Text className="text-sm text-gray-500">81 thành viên</Text>
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
