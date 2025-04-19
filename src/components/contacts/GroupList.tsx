import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CreateGroup from './CreateGroup';

export default function GroupList() {
    const [isCreateGroupVisible, setIsCreateGroupVisible] = useState(false);

    // Mock data for UI demonstration
    const groups = [
        { 
            id: '1', 
            name: 'Nhóm lập trình React Native', 
            avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png',
            memberCount: 156,
            lastActive: '2 giờ trước'
        },
        { 
            id: '2', 
            name: 'IUH CNM Group', 
            avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png',
            memberCount: 89,
            lastActive: '5 phút trước'
        },
        { 
            id: '3', 
            name: 'Nhóm đồ án', 
            avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png',
            memberCount: 12,
            lastActive: 'Vừa xong'
        },
    ];

    return (
        <View className="flex-1 bg-white">
            {/* Search Bar */}
            <View className="px-4 py-2 border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        className="flex-1 ml-2 text-base text-gray-800"
                        placeholder="Tìm nhóm..."
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* Create Group Button */}
            <TouchableOpacity 
                className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-blue-50"
                onPress={() => setIsCreateGroupVisible(true)}
            >
                <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
                    <Ionicons name="add" size={24} color="white" />
                </View>
                <Text className="ml-3 text-blue-500 font-medium">Tạo nhóm mới</Text>
            </TouchableOpacity>

            {/* Groups List */}
            <ScrollView className="flex-1">
                {groups.map(group => (
                    <TouchableOpacity
                        key={group.id}
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    >
                        <Image
                            source={{ uri: group.avatarUrl }}
                            className="w-12 h-12 rounded-full"
                        />
                        <View className="flex-1 ml-3">
                            <Text className="text-base font-medium text-gray-800">
                                {group.name}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                {group.memberCount} thành viên • {group.lastActive}
                            </Text>
                        </View>
                        <TouchableOpacity className="p-2">
                            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Create Group Modal */}
            <CreateGroup 
                visible={isCreateGroupVisible}
                onClose={() => setIsCreateGroupVisible(false)}
            />
        </View>
    );
} 