import React from 'react';
import {Text, View} from 'react-native';

interface DividerProps {
    text: string;
    className?: string;
}

const Divider = ({text, className = ''}: DividerProps) => {
    return (
        <View className={`flex-row items-center my-5 sm:my-6 ${className}`}>
            <View className="flex-1 h-[1px] bg-gray-200"/>
            <Text className="mx-3 sm:mx-4 text-gray-400 font-medium text-xs sm:text-sm">{text}</Text>
            <View className="flex-1 h-[1px] bg-gray-200"/>
        </View>
    );
};

export default Divider;