import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Message} from "@/src/models/Message";

interface ReplyPreviewBarProps {
    replyingTo: Message;
    senderName: string;
    onCancel: () => void;
}

const ReplyPreviewBar: React.FC<ReplyPreviewBarProps> = (
    {
        replyingTo,
        senderName,
        onCancel
    }) => {
    return (
        <View className="bg-gray-50 px-4 py-3 flex-row items-center border-t border-gray-200">
            <View className="flex-1">
                <View className="flex-row items-center">
                    <Ionicons name="return-up-back" size={16} color="#3B82F6"/>
                    <Text className="text-blue-500 text-sm font-medium ml-1">
                        Trả lời {senderName}
                    </Text>
                </View>
                <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
                    {replyingTo.content}
                </Text>
            </View>
            <TouchableOpacity
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
                onPress={onCancel}
            >
                <Ionicons name="close" size={16} color="#666"/>
            </TouchableOpacity>
        </View>
    );
};

export default ReplyPreviewBar;