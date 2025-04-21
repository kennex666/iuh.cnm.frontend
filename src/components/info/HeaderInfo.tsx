import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderInfoProps {
    isGroup: boolean;
    onBackPress?: () => void;
}

export default function HeaderInfo({ isGroup, onBackPress }: HeaderInfoProps) {
    return (
        <View className="h-16 px-6 border-b border-blue-100 flex-row items-center justify-between bg-white">
            <View className="flex-row items-center">
                {onBackPress && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        className="mr-4 w-9 h-9 bg-blue-50 rounded-full items-center justify-center active:bg-blue-100"
                    >
                        <Ionicons name="chevron-back" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                )}
                <Text className="text-[17px] font-semibold text-blue-950">
                    {isGroup ? 'Thông tin nhóm' : 'Thông tin người dùng'}
                </Text>
            </View>
        </View>
    );
}
