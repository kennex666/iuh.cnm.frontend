import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

interface TextLinkProps {
    text: string;
    linkText: string;
    onPress: () => void;
    className?: string;
}

const TextLink = ({text, linkText, onPress, className = ''}: TextLinkProps) => {
    return (
        <View className={`flex-row justify-center items-center ${className}`}>
            <Text className="text-gray-600 text-sm sm:text-base">
                {text}
            </Text>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.6}
                className="ml-1"
            >
                <Text className="text-blue-500 font-semibold text-sm sm:text-base">
                    {linkText}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default TextLink;