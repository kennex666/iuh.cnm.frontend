import React from 'react';
import {Text} from 'react-native';
import {Message} from "@/src/models/Message";

interface TextMessageProps {
    message: Message;
    isSender: boolean;
}

const TextMessage: React.FC<TextMessageProps> = (
    {
        message,
        isSender
    }) => {
    return (
        <Text className={isSender ? "text-white" : "text-gray-900"}>
            {message.content}
        </Text>
    );
};

export default TextMessage;