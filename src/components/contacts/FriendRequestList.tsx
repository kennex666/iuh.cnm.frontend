import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FriendRequestList() {
    const [requests, setRequests] = useState([
        {
            id: '1',
            sender: {
                id: '101',
                name: 'Nguyễn Văn A',
                avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png'
            },
            createAt: '2024-03-14T10:30:00Z'
        },
        {
            id: '2',
            sender: {
                id: '102',
                name: 'Trần Thị B',
                avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png'
            },
            createAt: '2024-03-14T09:15:00Z'
        },
        {
            id: '3',
            sender: {
                id: '103',
                name: 'Lê Văn C',
                avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png'
            },
            createAt: '2024-03-14T08:45:00Z'
        }
    ]);

    const handleAcceptRequest = (requestId: string) => {
        // TODO: Call API to accept friend request
        Alert.alert('Thông báo', 'Đã chấp nhận lời mời kết bạn');
        setRequests(requests.filter(request => request.id !== requestId));
    };

    const handleRejectRequest = (requestId: string) => {
        // TODO: Call API to reject friend request
        Alert.alert('Thông báo', 'Đã từ chối lời mời kết bạn');
        setRequests(requests.filter(request => request.id !== requestId));
    };

    if (requests.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Ionicons name="people-outline" size={48} color="#666" />
                <Text className="text-gray-500 mt-2">Không có lời mời kết bạn nào</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1">
            {requests.map((request) => (
                <View
                    key={request.id}
                    className="flex-row items-center p-4 border-b border-gray-100"
                >
                    <Image
                        source={{
                            uri: request.sender.avatarUrl
                        }}
                        className="w-12 h-12 rounded-full"
                    />
                    <View className="flex-1 ml-3">
                        <Text className="font-medium text-gray-900">
                            {request.sender.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            {new Date(request.createAt).toLocaleDateString()}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            className="bg-blue-500 px-4 py-2 rounded-full mr-2"
                            onPress={() => handleAcceptRequest(request.id)}
                        >
                            <Text className="text-white font-medium">Đồng ý</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-gray-100 px-4 py-2 rounded-full"
                            onPress={() => handleRejectRequest(request.id)}
                        >
                            <Text className="text-gray-700 font-medium">Từ chối</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
} 