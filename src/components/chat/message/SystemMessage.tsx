import React from 'react';
import {Text, View} from 'react-native';
import {Message} from "@/src/models/Message";

interface SystemMessageProps {
    message: Message;
    isHighlighted: boolean;
    onLayout: (event: any) => void;
}

const SystemMessage: React.FC<SystemMessageProps> = (
    {
        message,
        isHighlighted,
        onLayout
    }) => {
    return (
        <View
            key={message.id}
            className="flex-row justify-center mb-4"
            onLayout={onLayout}
        >
            <View className={`bg-gray-100 rounded-lg px-4 py-2 max-w-[80%] items-center ${
                isHighlighted ? "bg-yellow-100 border border-yellow-300" : ""
            }`}>
                <Text className="text-gray-500 text-xs mb-1">
                    System Message
                </Text>
                <Text className="text-gray-800 text-center">
                    {message.content}
                </Text>
            </View>
        </View>
    );
};

export default SystemMessage;