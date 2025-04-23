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
import { AuthStorage } from '@/src/storage/AuthStorage';
import { useUser } from '@/src/contexts/user/UserContext';
import { UserService } from '@/src/api/services/UserService';
import { User } from '@/src/models/User';

interface FriendInfo extends User {
    friendRequestDate: Date;
}

export default function ContactList() {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState<FriendInfo[]>([]);
    const { user } = useUser();

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
            if (response.success) {
                setFriendRequests(response.friendRequests);
                // Tạo mảng tạm để lưu thông tin bạn bè
                const tempFriends: FriendInfo[] = [];
                for(const request of response.friendRequests) {
                    const friendId = request.senderId === user.id ? request.receiverId : request.senderId;
                    const friend = await UserService.getUserById(friendId);
                    if(friend.success && friend.user) {
                        tempFriends.push({
                            ...friend.user,
                            friendRequestDate: request.createAt
                        } as FriendInfo);
                    }
                }
                // Cập nhật state friends một lần duy nhất
                setFriends(tempFriends);
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

    

    console.log('friendRequests', friendRequests);
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

            {/* Friend List */}
            <ScrollView className="flex-1">
                {friends.length === 0 ? (
                    <View className="flex-1 justify-center items-center p-4">
                        <Ionicons name="people-outline" size={48} color="#666" />
                        <Text className="text-gray-500 mt-2">Chưa có bạn bè nào</Text>
                    </View>
                ) : (
                    friends.map((friend) => (
                        <View key={friend.id} className="border-b border-gray-100">
                            <View className="flex-row items-center px-4 py-3">
                                <Image
                                    source={{ 
                                        uri: friend.avatarURL === "default" ? 
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=0068FF&color=fff` 
                                            : friend.avatarURL
                                    }}
                                    className="w-12 h-12 rounded-full"
                                />
                                <View className="flex-1 ml-3">
                                    <Text className="text-base font-medium text-gray-800">
                                        {friend.name}
                                    </Text>
                                    <Text className="text-sm text-gray-500">
                                        {friend.phone}
                                    </Text>
                                    <Text className="text-xs text-gray-400">
                                        {friend.email}
                                    </Text>
                                    <Text className="text-xs text-gray-400 mt-1">
                                        Kết bạn từ: {new Date(friend.friendRequestDate).toLocaleDateString('vi-VN')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
} 