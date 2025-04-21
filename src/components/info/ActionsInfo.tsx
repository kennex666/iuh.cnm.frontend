import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionsInfoProps {
    isGroup: boolean;
    onSearchPress: () => void;
}

export default function ActionsInfo({ isGroup, onSearchPress }: ActionsInfoProps) {
    return (
        <View className={`flex-row justify-around py-4 border-y border-blue-100`}>
            {/* Actions chung */}
            <TouchableOpacity className="items-center">
                <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                    <Ionicons name="notifications-off-outline" size={22} color="#3B82F6" />
                </View>
                <Text className="text-sm text-blue-900">Tắt thông báo</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={onSearchPress}>
                <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                    <Ionicons name="search-outline" size={22} color="#3B82F6" />
                </View>
                <Text className="text-sm text-blue-900">Tìm kiếm</Text>
            </TouchableOpacity>

            {isGroup ? (
                <TouchableOpacity className="items-center">
                    <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                        <Ionicons name="people-outline" size={22} color="#3B82F6" />
                    </View>
                    <Text className="text-sm text-blue-900">Quản lý nhóm</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity className="items-center">
                    <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                        <Ionicons name="person-outline" size={22} color="#3B82F6" />
                    </View>
                    <Text className="text-sm text-blue-900">Xem profile</Text>
                </TouchableOpacity>
            )}
        </View>
    );
} 