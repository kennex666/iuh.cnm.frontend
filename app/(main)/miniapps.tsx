import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function MiniAppsScreen() {
  return (
    <View className="flex-1 bg-white px-6 pt-14">
      {/* Header */}
      <Text className="text-3xl font-extrabold text-gray-900 mb-8">Mini Apps</Text>
      {/* Card Container */}
      <View className="space-y-6">
        {/* Học sinh Card */}
        <TouchableOpacity
          className="flex-row items-center bg-white rounded-2xl shadow-md px-6 py-5 mb-4"
          style={{
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
          activeOpacity={0.9}
          onPress={() => router.push('/students')}
        >
          <View className="bg-blue-100 rounded-xl p-3 mr-4">
            <MaterialCommunityIcons name="account-child-outline" size={32} color="#2563eb" />
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-900">Học sinh</Text>
            <Text className="text-gray-400 text-sm mt-1">Mini app dành cho sinh viên</Text>
          </View>
        </TouchableOpacity>
        {/* Template Card */}
        <TouchableOpacity
          className="flex-row items-center bg-white rounded-2xl shadow-md px-6 py-5"
          style={{
            elevation: 4,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
          activeOpacity={0.9}
          onPress={() => {
            router.push('/miniapp')  
          }}
        >
          <View className="bg-gray-200 rounded-xl p-3 mr-4">
            <MaterialCommunityIcons name="file-document-outline" size={32} color="#6b7280" />
          </View>
          <View>
            <Text className="text-lg font-bold text-gray-900">Template</Text>
            <Text className="text-gray-400 text-sm mt-1">Mẫu mini app khác</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
