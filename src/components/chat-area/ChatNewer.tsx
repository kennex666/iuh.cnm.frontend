import { Ionicons } from '@expo/vector-icons'
import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default function ChatNewer ({selectedChat}: any) {
    return (
        <View className="items-center justify-center mb-8">
        <View className="bg-blue-50 rounded-2xl p-6 max-w-[80%] items-center">
            <Ionicons
                name="chatbubble-ellipses-outline"
                size={48}
                color="#3B82F6"
            />
            <Text className="text-blue-600 font-semibold text-lg mt-4 text-center">
                Chưa có tin nhắn nào
            </Text>
            <Text className="text-gray-600 text-center mt-2">
                Hãy gửi lời chào để bắt đầu cuộc trò chuyện với{" "}
                {selectedChat.name || "người dùng này"}
            </Text>
        </View>
    </View>
    )
}
