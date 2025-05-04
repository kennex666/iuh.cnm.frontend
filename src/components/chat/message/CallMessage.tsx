import React from 'react';
import {Text} from 'react-native';

interface CallMessageProps {
    content: string;
    isSender: boolean;
}

const CallMessage: React.FC<CallMessageProps> = (
    {
        content,
        isSender
    }) => {
    return (
        <Text className={isSender ? "text-white" : "text-gray-900"}>
            {content === "start" ? "📞 Cuộc gọi đang bắt đầu" : "📴 Cuộc gọi đã kết thúc"}
        </Text>
    );
};

export default CallMessage;