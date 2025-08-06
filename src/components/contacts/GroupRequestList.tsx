import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View,} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function GroupRequestList() {
    // Mock data for UI demonstration
    const requests = [
        {
            id: '1',
            group: {
                id: '101',
                name: 'Nhóm lập trình React Native',
                avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png',
                memberCount: 156
            },
            inviter: 'Nguyễn Văn A',
            createAt: '2024-03-14T10:30:00Z'
        },
        {
            id: '2',
            group: {
                id: '102',
                name: 'IUH CNM Group',
                avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png',
                memberCount: 89
            },
            inviter: 'Trần Thị B',
            createAt: '2024-03-14T09:15:00Z'
        },
    ];

    if (requests.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Ionicons name="people-outline" size={48} color="#666"/>
                <Text className="text-gray-500 mt-2">Không có lời mời tham gia nhóm nào</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1">
            {requests.map((request) => (
                <View
                    key={request.id}
                    className="p-4 border-b border-gray-100"
                >
                    <View className="flex-row items-center">
                        <Image
                            source={{uri: request.group.avatarUrl}}
                            className="w-12 h-12 rounded-full"
                        />
                        <View className="flex-1 ml-3">
                            <Text className="text-base font-medium text-gray-800">
                                {request.group.name}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                {request.group.memberCount} thành viên
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">
                                Được mời bởi {request.inviter} • {new Date(request.createAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row justify-end mt-3">
                        <TouchableOpacity
                            className="bg-blue-500 px-4 py-2 rounded-full mr-2"
                        >
                            <Text className="text-white font-medium">Tham gia</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-gray-100 px-4 py-2 rounded-full"
                        >
                            <Text className="text-gray-700 font-medium">Từ chối</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
} 