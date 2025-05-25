import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {FriendRequestService} from '@/src/api/services/FriendRequestService';
import {FriendRequest} from '@/src/models/FriendRequest';
import {useUser} from '@/src/contexts/user/UserContext';
import {UserService} from '@/src/api/services/UserService';
import {User} from '@/src/models/User';
import { router } from 'expo-router';
import Toast from '../ui/Toast';

interface FriendInfo extends User {
    friendRequestDate: Date;
}

export default function ContactList() {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState<FriendInfo[]>([]);
    const {user} = useUser();
    const [showProfile, setShowProfile] = useState(false);
    const [phone , setPhone] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any | null>(null);

    useEffect(() => {
        loadFriendRequests();
    }, [user]);

    useEffect(() => {
        // lay thong tin ban be
        if (phone) {
            UserService.getUserByPhone(phone).then(response => {
                if (response.success) {
                    console.log('User info:', response.users);
                    if (response.users && response.users.length > 0) {
                        setUserInfo(response.users[0]);
                    }
                }
            }
            ).catch(err => {
                setError('Không thể lấy thông tin người dùng');
            });
        }
    }
    , [phone]);

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
                for (const request of response.friendRequests) {
                    const friendId = request.senderId === user.id ? request.receiverId : request.senderId;
                    const friend = await UserService.getUserById(friendId);
                    if (friend.success && friend.user) {
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

    const profileOfUser = () => {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-gray-500">Chưa có bạn bè nào</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Search Bar */}
            <View className="px-4 py-2 border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Ionicons name="search" size={20} color="#666"/>
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
                        <Ionicons name="people-outline" size={48} color="#666"/>
                        <Text className="text-gray-500 mt-2">Chưa có bạn bè nào</Text>
                    </View>
                ) : (
                    friends.map((friend) => (
                        <View key={friend.id} className="flex-row justify-between border-b border-gray-100 ">
                            <TouchableOpacity className="flex-row items-center px-4 py-3"
                                onPress={() => {
                                    setShowProfile(true);
                                    setPhone(friend.phone);
                                }}
                            >
                                <Image
                                    source={{
                                        uri: friend.avatarURL === "default" ?
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.name)}&background=0068FF&color=fff`
                                            : friend.avatarURL
                                    }}
                                    className="w-12 h-12 rounded-full"
                                />
                                <View className="ml-3">
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
                            </TouchableOpacity>
                            <View className="px-4 py-2 justify-center items-center">
                                <Ionicons
                                    name="chatbubble-ellipses-outline"
                                    size={28}
                                    color="#0068FF"
                                    style={{}}
                                    onPress={() => {
                                        // TODO: Navigate to chat screen with this friend
                                        router.push({
                                            pathname: '/(main)',
                                            params: {
                                                conversationId: "305322850577810432", // Replace with the actual conversation ID for this friend
                                            }
                                        });
                                    }}
                                />
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
            {/* Profile Modal */}
            {showProfile && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-50 justify-center items-center">
                    <View className="bg-white rounded-2xl shadow-lg w-11/12 max-w-md p-2 items-center relative">
                        <TouchableOpacity
                            className="absolute top-3 right-3 z-10 bg-gray-100 rounded-full p-1 shadow"
                            onPress={() => setShowProfile(false)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={22} color="#0068FF" />
                        </TouchableOpacity>
                        {/* Cover Photo */}
                        <View className="w-full h-40 rounded-xl overflow-hidden mb-[-48px]">
                            <Image
                                source={{
                                    uri: userInfo?.avatarURL
                                        ? userInfo.avatarURL
                                        : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
                                }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>
                        {/* Avatar */}
                        <Image
                            source={{
                                uri: userInfo?.avatarURL === "default"
                                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name || 'User')}&background=0068FF&color=fff`
                                    : userInfo?.avatarURL
                            }}
                            className="w-24 h-24 rounded-full mb-4 border-2 border-white"
                            style={{ marginTop: -48 }}
                        />
                        <Text className="text-2xl font-semibold text-gray-900 mb-1 pt-2">
                            {userInfo?.name || 'Không có tên'}
                        </Text>
                        <Text className="text-base text-gray-500 mb-4">
                            @{userInfo?.username || 'N/A'}
                        </Text>
                        <View className="w-full mt-2 p-4">
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="call-outline" size={18} color="#0068FF" />
                                <Text className="ml-2 text-base text-gray-700">
                                    {userInfo?.phone || 'N/A'}
                                </Text>
                            </View>
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="mail-outline" size={18} color="#0068FF" />
                                <Text className="ml-2 text-base text-gray-700">
                                    {userInfo?.email || 'N/A'}
                                </Text>
                            </View>
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="gift-outline" size={18} color="#0068FF" />
                                <Text className="ml-2 text-base text-gray-700">
                                    {userInfo?.dob
                                        ? new Date(userInfo.dob).toLocaleDateString('vi-VN')
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View className="flex-row items-center mb-4">
                                <Ionicons
                                    name={
                                        userInfo?.gender === 'male'
                                            ? 'male-outline'
                                            : userInfo?.gender === 'female'
                                            ? 'female-outline'
                                            : 'person-outline'
                                    }
                                    size={18}
                                    color="#0068FF"
                                />
                                <Text className="ml-2 text-base text-gray-700">
                                    {userInfo?.gender === 'male'
                                        ? 'Nam'
                                        : userInfo?.gender === 'female'
                                        ? 'Nữ'
                                        : 'Khác'}
                                </Text>
                            </View>
                            <View className="flex-row items-center mb-4">
                                <Ionicons name="calendar-outline" size={18} color="#0068FF" />
                                <Text className="ml-2 text-base text-gray-700">
                                    Kết bạn từ: {userInfo?.friendRequestDate
                                        ? new Date(userInfo.friendRequestDate).toLocaleDateString('vi-VN')
                                        : 'N/A'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
} 