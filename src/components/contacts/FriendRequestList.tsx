import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FriendRequestService } from '@/src/api/services/FriendRequestService';
import FriendRequest from '@/src/models/FriendRequest';
import { useAuth } from '@/src/contexts/UserContext';

export default function FriendRequestList() {
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        loadFriendRequests();
    }, [user]);

    const loadFriendRequests = async () => {
        try {
            setLoading(true);
            if (!user) {
                setError('Không tìm thấy thông tin người dùng');
                return;
            }

            const response = await FriendRequestService.getAllPendingFriendRequests(user.id || "");
            if (response.success) {
                setRequests(response.friendRequests);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Lỗi khi tải danh sách lời mời kết bạn');
            console.error('Lỗi khi tải danh sách lời mời kết bạn:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const response = await FriendRequestService.acceptFriendRequest(requestId);
            if (response.success) {
                Alert.alert('Thông báo', 'Đã chấp nhận lời mời kết bạn');
                loadFriendRequests(); // Reload the list
            } else {
                Alert.alert('Lỗi', response.message || 'Không thể chấp nhận lời mời kết bạn');
            }
        } catch (err) {
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi chấp nhận lời mời kết bạn');
            console.error('Lỗi khi chấp nhận lời mời kết bạn:', err);
        }
    };

    const handleDeclineRequest = async (requestId: string) => {
        try {
            const response = await FriendRequestService.declineFriendRequest(requestId);
            if (response.success) {
                Alert.alert('Thông báo', 'Đã từ chối lời mời kết bạn');
                loadFriendRequests(); // Reload the list
            } else {
                Alert.alert('Lỗi', response.message || 'Không thể từ chối lời mời kết bạn');
            }
        } catch (err) {
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi từ chối lời mời kết bạn');
            console.error('Lỗi khi từ chối lời mời kết bạn:', err);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#0068FF" />
                <Text className="mt-2 text-gray-500">Đang tải...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
                <Text className="text-red-500 mt-2 text-center">{error}</Text>
                <TouchableOpacity
                    className="mt-4 bg-blue-500 px-4 py-2 rounded-full"
                    onPress={loadFriendRequests}
                >
                    <Text className="text-white font-medium">Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                            uri: `https://ui-avatars.com/api/?name=${request.senderId}&background=0068FF&color=fff`
                        }}
                        className="w-12 h-12 rounded-full"
                    />
                    <View className="flex-1 ml-3">
                        <Text className="font-medium text-gray-900">
                            {request.senderId}
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
                            onPress={() => handleDeclineRequest(request.id)}
                        >
                            <Text className="text-gray-700 font-medium">Từ chối</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
} 