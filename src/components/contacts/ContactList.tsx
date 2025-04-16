import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FriendRequestService } from '@/src/api/services/FriendRequestService';
import FriendRequest from '@/src/models/FriendRequest';
import { AuthStorage } from '@/src/services/AuthStorage';
import { useAuth } from '@/src/contexts/UserContext';

export default function ContactList() {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        loadFriendRequests();
    }, [user]);

    const loadFriendRequests = async () => {
        try {
            setLoading(true);
            if (!user) {
                setError('Không tìm thấy ID người dùng');
                return;
            }

            const response = await FriendRequestService.getAllAcceptedFriendRequests(user.id || "");
            console.log(response);
            if (response.success) {
                setFriendRequests(response.friendRequests);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Lỗi khi tải danh sách bạn bè');
            console.error('Lỗi khi tải danh sách bạn bè:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (id: string) => {
        try {
            const response = await FriendRequestService.acceptFriendRequest(id);
            if (response.success) {
                loadFriendRequests(); // Reload the list
            }
        } catch (err) {
            console.error('Lỗi khi chấp nhận lời mời kết bạn:', err);
        }
    };

    const handleDeclineRequest = async (id: string) => {
        try {
            const response = await FriendRequestService.declineFriendRequest(id);
            if (response.success) {
                loadFriendRequests(); // Reload the list
            }
        } catch (err) {
            console.error('Lỗi khi từ chối lời mời kết bạn:', err);
        }
    };

    const filteredRequests = friendRequests.filter(request => 
        request.senderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.receiverId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-red-500">{error}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Search Bar */}
            <View className="px-4 py-2 border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        className="flex-1 ml-2 text-base text-gray-800"
                        placeholder="Tìm bạn bè..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Friend Requests List */}
            <ScrollView className="flex-1">
                {filteredRequests.map(request => (
                    <View key={request.id} className="border-b border-gray-100">
                        <View className="flex-row items-center px-4 py-3">
                            <Image
                                source={{ uri: `https://ui-avatars.com/api/?name=${request.senderId}` }}
                                className="w-12 h-12 rounded-full"
                            />
                            <View className="flex-1 ml-3">
                                <Text className="text-base font-medium text-gray-800">
                                    {request.senderId}
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    {request.status === 'pending' ? 'Đang chờ xác nhận' :
                                     request.status === 'accepted' ? 'Đã chấp nhận' :
                                     'Đã từ chối'}
                                </Text>
                                <Text className="text-xs text-gray-400">
                                    {new Date(request.createAt).toLocaleDateString()}
                                </Text>
                            </View>
                            {request.status === 'pending' && (
                                <View className="flex-row">
                                    <TouchableOpacity 
                                        className="p-2 mr-2"
                                        onPress={() => handleAcceptRequest(request.id)}
                                    >
                                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        className="p-2"
                                        onPress={() => handleDeclineRequest(request.id)}
                                    >
                                        <Ionicons name="close-circle" size={24} color="#F44336" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
} 