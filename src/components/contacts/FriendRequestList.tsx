import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FriendRequestService } from '@/src/api/services/FriendRequestService';
import { UserService } from '@/src/api/services/UserService';
import FriendRequest from '@/src/models/FriendRequest';
import { useAuth } from '@/src/contexts/UserContext';
import SocketService from '@/src/api/services/SocketService';

export default function FriendRequestList() {
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const { user } = useAuth();
    const [friendAccepted, setFriendAccepted] = useState<FriendRequest[]>([]);
    const [friendSent, setFriendSent] = useState<FriendRequest[]>([]);
    const [senderNames, setSenderNames] = useState<Record<string, string>>({});
    const [senderAvatars, setSenderAvatars] = useState<Record<string, string>>({});

    // Fetch sender info
    useEffect(() => {
        const fetchSenderInfo = async () => {
            const uniqueSenderIds = new Set<string>();
            requests.forEach(request => uniqueSenderIds.add(request.senderId));
            friendAccepted.forEach(request => uniqueSenderIds.add(request.senderId));
            friendSent.forEach(request => uniqueSenderIds.add(request.senderId));

            for (const senderId of uniqueSenderIds) {
                if (!senderNames[senderId] || !senderAvatars[senderId]) {
                    try {
                        const response = await UserService.getUserById(senderId);
                        if (response.success && response.user) {
                            setSenderNames(prev => ({
                                ...prev,
                                [senderId]: response.user?.name || 'Unknown'
                            }));
                            setSenderAvatars(prev => ({
                                ...prev,
                                [senderId]: response.user?.avatarURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user?.name || 'User')}&background=0068FF&color=fff`
                            }));
                        }
                    } catch (error) {
                        console.error('Error fetching user:', error);
                    }
                }
            }
        };

        fetchSenderInfo();
    }, [requests, friendAccepted, friendSent]);

    useEffect(() => {
        loadFriendRequests();
        // Set up socket listeners
        const socketService = SocketService.getInstance();
        
        // Listen for new friend requests
        const handleNewFriendRequest = (friendRequest: FriendRequest) => {
            console.log('New friend request received:', friendRequest);
            if (friendRequest.receiverId === user?.id) {
                // If the current user is the receiver, add the request to the list
                setRequests(prevRequests => [...prevRequests, friendRequest]);
            }
        };

        const handleActionFriendRequest = (requestId: string) => {
            console.log('requestId', requestId);
            loadFriendRequests();
        }

        const handleDeleteFriendRequest = (friendRequest: FriendRequest) => {
            console.log('Delete friend request received:', friendRequest);
            loadFriendRequests();
        }
        socketService.onFriendRequestAction(handleActionFriendRequest);
        socketService.onFriendRequest(handleNewFriendRequest);
        socketService.onDeleteFriendRequest(handleDeleteFriendRequest);
        
        // Cleanup socket listeners
        return () => {
            socketService.removeFriendRequestListener(handleNewFriendRequest);
            socketService.removeDeleteFriendRequestListener(handleDeleteFriendRequest);
        };
    }, [user]);

    const loadFriendRequests = async () => {
        try {
            setLoading(true);
            if (!user) {
                setError('Không tìm thấy thông tin người dùng');
                return;
            }

            const response = await FriendRequestService.getAllPendingFriendRequests(user.id || "");
            const responseAccepted = await FriendRequestService.getAllAcceptedFriendRequests(user?.id || "");
            const responseSent = await FriendRequestService.getAllPendingFriendRequestsBySenderId();
            if (response.success && responseAccepted.success && responseSent.success) {
                setRequests(response.friendRequests);
                setFriendAccepted(responseAccepted.friendRequests);
                setFriendSent(responseSent.friendRequests);
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

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        //reset
        setSearchResults([]);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const response = await UserService.getUserByPhone(query);
            console.log(response);
            if (response.success && response.users && response.users.length > 0) {
                const results = response.users.map(user => ({
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                    avatar: user.avatarURL === "default" ? 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0068FF&color=fff` 
                        : user.avatarURL
                }));
                setSearchResults(results);
            } else {
                setSearchResults([]);
                Alert.alert('Thông báo', 'Không tìm thấy người dùng');
            }
        } catch (err) {
            Alert.alert('Lỗi', 'Không thể tìm kiếm người dùng');
            console.error('Lỗi khi tìm kiếm:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSendFriendRequest = async (receiverId: string) => {
        try {
            if (!user) {
                console.log('Không tìm thấy thông tin người dùng');
                return;
            }

            const newRequest = {
                senderId: user.id || '',
                receiverId: receiverId
            };

            const response = await FriendRequestService.createFriendRequest(newRequest);
            await loadFriendRequests();  
            if (response.success) {
                // Send friend request through socket
                const socketService = SocketService.getInstance();
                socketService.sendFriendRequest(newRequest);
            } else {
                console.log('Không thể gửi lời mời kết bạn');
            }

            console.log('Đã gửi lời mời kết bạn');
            setSearchQuery('');
            setSearchResults([]);
        } catch (err) {
            console.log('Lỗi khi gửi lời mời kết bạn:', err);
        }
    };
    const handleDeclineRequest = async (requestId: string) => {
        try {
            const response = await FriendRequestService.declineFriendRequest(requestId);
            if (response.success) {
                console.log('Đã từ chối lời mời kết bạn');
                loadFriendRequests();
            } else {
                console.log('Không thể từ chối lời mời kết bạn');
            }
        } catch (err) {
            console.log('Lỗi khi từ chối lời mời kết bạn:', err);
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const response = await FriendRequestService.acceptFriendRequest(requestId);
            if (response.success) {
                console.log('Đã chấp nhận mời kết bạn');
                loadFriendRequests(); // Reload the list
            } else {
                console.log('Không thể chấp nhận lời mời kết bạn');
            }
        } catch (err) {
            console.log('Lỗi khi chấp nhận lời mời kết bạn:', err);
        }
    };

    const handleCancelRequest = async (requestId: string) => {
        try {
            console.log('requestId', requestId);
            const response = await FriendRequestService.deleteFriendRequest(requestId);
            if (response.success) {
                console.log('Đã hủy lời mời kết bạn');
                const socketService = SocketService.getInstance();
                loadFriendRequests();
            } else {
                console.log('Không thể hủy lời mời kết bạn');
            }
        } catch (err) {
            console.log('Lỗi khi hủy lời mời kết bạn:', err);
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

    return (
        <View className="flex-1">
            {/* Search Section */}
            <View className="p-4 border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        className="flex-1 ml-2 text-base text-gray-800"
                        placeholder="Tìm kiếm theo số điện thoại..."
                        placeholderTextColor="#666"
                        value={searchQuery}
                        onChangeText={handleSearch}
                        keyboardType="phone-pad"
                    />
                    {isSearching && (
                        <ActivityIndicator size="small" color="#0068FF" />
                    )}
                </View>
            </View>

            {/* Search Results */}
            {searchResults.length > 0 && (
                <View className="border-b border-gray-200">
                    <Text className="px-4 py-2 text-sm font-semibold text-gray-500">Kết quả tìm kiếm</Text>
                    {searchResults.map((result) => {
                        // Check if user is already a friend
                        const isFriend = friendAccepted.some(
                            request => request.senderId === result.id || request.receiverId === result.id
                        );
                        // Check if there's a pending request sent by current user
                        const pendingRequestSent = friendSent.find(
                            request => request.receiverId === result.id
                        );
                        // Check if there's a pending request received by current user
                        const pendingRequestReceived = requests.find(
                            request => request.senderId === result.id
                        );

                        if (result.id !== user?.id) {
                            return (
                                <View
                                    key={`search-result-${result.id}`}
                                    className="flex-row items-center p-4 border-b border-gray-100"
                                >
                                    <Image
                                        key={`search-image-${result.id}`}
                                        source={{ uri: result.avatar }}
                                        className="w-12 h-12 rounded-full"
                                    />
                                    <View key={`search-info-${result.id}`} className="flex-1 ml-3">
                                        <Text className="font-medium text-gray-900">
                                            {result.name}
                                        </Text>
                                        <Text className="text-sm text-gray-500">
                                            {result.phone}
                                        </Text>
                                    </View>
                                    {isFriend ? (
                                        <View key={`search-friend-${result.id}`} className="bg-gray-100 px-4 py-2 rounded-full">
                                            <Text className="text-gray-700 font-medium">Bạn bè</Text>
                                        </View>
                                    ) : pendingRequestSent ? (
                                        pendingRequestSent.status === "declined" ? (
                                            <View key={`search-decl ined-${result.id}`} className="bg-red-100 px-4 py-2 rounded-full">
                                                <Text className="text-red-600 font-medium">Đã từ chối</Text>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                key={`search-cancel-${result.id}`}
                                                className="bg-red-500 px-4 py-2 rounded-full"
                                                onPress={() => handleCancelRequest(pendingRequestSent.id)}
                                            >
                                                <Text className="text-white font-medium">Hủy kết bạn</Text>
                                            </TouchableOpacity>
                                        )
                                    ) : pendingRequestReceived ? (
                                        <TouchableOpacity
                                            key={`search-accept-${result.id}`}
                                            className="bg-blue-500 px-4 py-2 rounded-full"
                                            onPress={() => handleAcceptRequest(pendingRequestReceived.id)}
                                        >
                                            <Text className="text-white font-medium">Đồng ý</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            key={`search-add-${result.id}`}
                                            className="bg-blue-500 px-4 py-2 rounded-full"
                                            onPress={() => handleSendFriendRequest(result.id)}
                                        >
                                            <Text className="text-white font-medium">Kết bạn</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            );
                        }
                        return null;
                    })}
                </View>
            )}

            {/* Friend Requests List */}
            <ScrollView className="flex-1">
                <Text className="px-4 py-2 text-sm font-semibold text-gray-500">Lời mời kết bạn</Text>
                {requests.length === 0 ? (
                    <View key="no-requests" className="items-center justify-center p-4">
                        <Ionicons name="people-outline" size={48} color="#666" />
                        <Text className="text-gray-500 mt-2">Không có lời mời kết bạn nào</Text>
                    </View>
                ) : (
                    requests.map((request) => (
                        <View
                            key={`request-${request.id}`}
                            className="flex-row items-center p-4 border-b border-gray-100"
                        >
                            <Image
                                key={`request-image-${request.id}`}
                                source={{ uri: senderAvatars[request.senderId] || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderNames[request.senderId] || 'User')}&background=0068FF&color=fff` }}
                                className="w-12 h-12 rounded-full"
                                onError={(e) => {
                                    console.log('Avatar load error:', e.nativeEvent.error);
                                    // Fallback to ui-avatars if the original avatar fails to load
                                    const fallbackURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(senderNames[request.senderId] || 'User')}&background=0068FF&color=fff`;
                                    if (senderAvatars[request.senderId] !== fallbackURL) {
                                        setSenderAvatars(prev => ({
                                            ...prev,
                                            [request.senderId]: fallbackURL
                                        }));
                                    }
                                }}
                            />
                            <View key={`request-info-${request.id}`} className="flex-1 ml-3">
                                <Text className="font-medium text-gray-900">
                                    {senderNames[request.senderId] || 'Loading...'}
                                </Text>
                                <Text className="text-sm text-gray-500">
                                    {new Date(request.createAt).toLocaleString()}
                                </Text>
                            </View>
                            <View key={`request-actions-${request.id}`} className="flex-row items-center">
                                {request.status !== "declined" ? (
                                    <>
                                        <TouchableOpacity
                                            key={`request-accept-${request.id}`}
                                            className="bg-blue-500 px-4 py-2 rounded-full mr-2"
                                            onPress={() => handleAcceptRequest(request.id)}
                                        >
                                            <Text className="text-white font-medium">Đồng ý</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            key={`request-decline-${request.id}`}
                                            className="bg-gray-100 px-4 py-2 rounded-full"
                                            onPress={() => handleDeclineRequest(request.id)}
                                        >
                                            <Text className="text-gray-700 font-medium">Từ chối</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <View className="bg-red-100 px-4 py-2 rounded-full">
                                        <Text className="text-red-600 font-medium">Đã từ chối</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
} 