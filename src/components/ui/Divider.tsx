import React from 'react';
import {Text, View} from 'react-native';

interface DividerProps {
    text?: string;
    direction?: 'horizontal' | 'vertical';
    color?: string;
    thickness?: number;
    className?: string;
}

const Divider = ({
                     text,
                     direction = 'horizontal',
                     color = 'bg-gray-200',
                     thickness = 1,
                     className = ''
                 }: DividerProps) => {
    if (direction === 'vertical') {
        return (
            <View
                className={`h-full w-[${thickness}px] ${color} ${className}`}
            />
        );
    }

    if (!text) {
        return <View className={`w-full h-[${thickness}px] ${color} ${className}`} />;
    }

    return (
        <View className={`flex-row items-center my-5 sm:my-6 ${className}`}>
            <View className={`flex-1 h-[${thickness}px] ${color}`}/>
            <Text className="mx-3 sm:mx-4 text-gray-400 font-medium text-xs sm:text-sm">{text}</Text>
            <View className={`flex-1 h-[${thickness}px] ${color}`}/>
        </View>
    );
};

export default Divider;