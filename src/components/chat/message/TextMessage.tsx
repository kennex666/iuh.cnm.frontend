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
        <Text className={`${isSender ? "text-gray-800" : "text-gray-800"} text-[15px] font-normal`}>
            {message.content}
        </Text>
    );
};

export default TextMessage;