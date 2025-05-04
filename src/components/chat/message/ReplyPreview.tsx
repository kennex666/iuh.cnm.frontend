import React from 'react';
import {Text, View} from 'react-native';
import {Message, MessageType} from "@/src/models/Message";

interface ReplyPreviewProps {
    repliedMessage: Message;
    isSender: boolean;
    userName: string;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({
    repliedMessage,
    isSender,
    userName
}) => {
    const getPreviewContent = () => {
        switch (repliedMessage.type) {
            case MessageType.TEXT:
                return repliedMessage.content;
            case MessageType.FILE:
                return "Đã gửi một tệp tin";
            case MessageType.VOTE:
                return "Đã tạo một cuộc bình chọn";
            case MessageType.CALL:
                return "Cuộc gọi";
            default:
                return "Tin nhắn";
        }
    };

    return (
        <View 
            className={`border-l-2 pl-2 ${
                isSender 
                    ? "border-white/70 bg-black/20" 
                    : "border-[#0084ff]"
            }`}
        >
            <Text 
                className={`text-xs font-medium ${
                    isSender 
                        ? "text-white" 
                        : "text-[#0084ff]"
                }`}
            >
                {userName}
            </Text>
            <Text 
                className={`text-xs ${
                    isSender 
                        ? "text-white/90" 
                        : "text-gray-600"
                }`}
                numberOfLines={1}
            >
                {getPreviewContent()}
            </Text>
        </View>
    );
};

export default ReplyPreview;