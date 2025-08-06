import React from 'react';
import {Text, View} from 'react-native';
import {Message} from "@/src/models/Message";

interface SystemMessageProps {
    message: any;
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
            className="flex-row justify-center"
            onLayout={onLayout}
        >
            <View className={`py-2 max-w-[80%] items-center ${
                isHighlighted ? "text-yellow-600" : ""
            }`}>
                <Text className="text-gray-800 text-center">
                    {message?.content || message || "Phiên bản đã cũ, vui lòng cập nhật"}
                </Text>
            </View>
        </View>
    );
};

export default SystemMessage;