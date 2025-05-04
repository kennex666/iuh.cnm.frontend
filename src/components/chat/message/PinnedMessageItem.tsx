// src/components/chat/pinned/PinnedMessageItem.tsx
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Message} from "@/src/models/Message";

interface PinnedMessageItemProps {
    message: Message;
    sender: any;
    onPress: () => void;
}

const PinnedMessageItem: React.FC<PinnedMessageItemProps> = (
    {
        message,
        sender,
        onPress
    }) => {
    return (
        <TouchableOpacity
            className="p-3 border-b border-gray-100 active:bg-gray-50"
            onPress={onPress}
        >
            <View className="flex-row items-center">
                <Image
                    source={{
                        uri: sender?.avatarURL ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                sender?.name || "User"
                            )}&background=0068FF&color=fff`
                    }}
                    className="w-8 h-8 rounded-full"
                    resizeMode="cover"
                />
                <View className="ml-2 flex-1">
                    <Text className="font-medium text-gray-800">
                        {sender?.name || "Unknown User"}
                    </Text>
                    <Text className="text-gray-500 text-sm" numberOfLines={2}>
                        {message.content}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666"/>
            </View>
        </TouchableOpacity>
    );
};

export default PinnedMessageItem;