import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Message} from "@/src/models/Message";

interface PinnedMessageItemProps {
    message: Message;
    sender: any;
    onPress: () => void;
    onUnpin?: (messageId: string) => void;
    canUnpin?: boolean;
}

const PinnedMessageItem: React.FC<PinnedMessageItemProps> = (
    {
        message,
        sender,
        onPress,
        onUnpin,
        canUnpin = true
    }) => {
    
    const handleUnpin = (e: any) => {
        e.stopPropagation();
        if (onUnpin) {
            onUnpin(message.id);
        }
    };
    
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
                
                <View className="flex-row items-center">
                    {canUnpin && (
                        <TouchableOpacity 
                            onPress={handleUnpin}
                            className="mr-2 p-1"
                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        >
                            <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                    )}
                    <Ionicons name="chevron-forward" size={16} color="#666"/>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PinnedMessageItem;