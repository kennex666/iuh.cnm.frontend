import React from 'react';
import {Text, View} from 'react-native';
import {Message} from "@/src/models/Message";

interface ReplyPreviewProps {
    repliedToMessage: Message;
    userName: string;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = (
    {
        repliedToMessage,
        userName
    }) => {
    return (
        <View className="bg-gray-100 rounded-lg px-3 py-2 border-l-2 border-blue-500 mb-1">
            <Text className="text-xs text-gray-500">
                Trả lời {userName}
            </Text>
            <Text className="text-sm text-gray-700" numberOfLines={1}>
                {repliedToMessage?.content || "Tin nhắn đã bị xoá"}
            </Text>
        </View>
    );
};

export default ReplyPreview;