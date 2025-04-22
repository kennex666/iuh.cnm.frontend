import { Ionicons } from "@expo/vector-icons";
import React, { Component } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MessageService } from "@/src/api/services/MessageService";
import { Conversation } from "@/src/models/Conversation";

interface ChatHeaderProps {
  selectedChat: Conversation; // Replace with the actual type of selectedChat
  onBackPress?: () => void;
  onInfoPress?: () => void;
  information?: any; // Replace with the actual type of information
}

export default function ChatHeader({
  selectedChat,
  onBackPress,
  onInfoPress,
  information,
}: ChatHeaderProps) {
  {
    return (
      <View className="h-16 px-4 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {onBackPress && (
            <TouchableOpacity onPress={onBackPress} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#666" />
            </TouchableOpacity>
          )}
          <Image
            source={{ uri: selectedChat?.avatarUrl?.trim() || "https://placehold.co/400" }}
            className="w-12 h-12 rounded-full"
          />
          <View className="ml-3" style={{ maxWidth: "45%" }}>
            <Text
              className="font-semibold text-gray-900 text-lg"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedChat.name || "No name"}
            </Text>
            {selectedChat.isGroup && (
              <Text className="text-sm text-gray-500">
                {selectedChat.participantIds.length} thành viên
              </Text>
            )}
            {!selectedChat.isGroup && selectedChat.participantIds.length > 0 && (
              <Text className="text-sm text-green-500">Đang hoạt động</Text>
            )}
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            className="p-2 mr-1"
            onPress={() => {
              MessageService.makeACall(selectedChat.id);
            }}
          >
            <Ionicons name="call-outline" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              MessageService.makeACall(selectedChat.id);
            }}
            className="p-2 mr-1"
          >
            <Ionicons name="videocam-outline" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2" onPress={onInfoPress}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
