import React, {useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Conversation} from '@/src/hooks/useConversations';
import Search from './Search';

// Props interface cho component Info
export interface InfoProps {
    selectedChat: Conversation | null;  // Cuộc trò chuyện được chọn, null nếu chưa chọn
    onBackPress?: () => void;
}

export default function Info({selectedChat, onBackPress}: InfoProps) {
    // State quản lý hiển thị/ẩn search modal
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    // Handler mở search modal
    const handleSearchPress = () => {
        setIsSearchVisible(true);
    };

    // Hiển thị placeholder khi chưa chọn cuộc trò chuyện
    if (!selectedChat) {
        return (
            <View className="flex-1 items-center justify-center border-l border-gray-200">
                <Text className="text-gray-500">Chọn một cuộc trò chuyện để xem thông tin</Text>
            </View>
        );
    }

    // Giao diện cho chat cá nhân
    if (!selectedChat.isGroup) {
        return (
            <View className="flex-1 bg-white border-l border-gray-200">
                <ScrollView className="flex-1">
                    {/* Header - Hiển thị tiêu đề phần thông tin */}
                    <View className="h-14 px-4 border-b border-gray-200 flex-row items-center">
                        {onBackPress && (
                            <TouchableOpacity onPress={onBackPress} className="mr-3">
                                <Ionicons name="arrow-back" size={24} color="#666" />
                            </TouchableOpacity>
                        )}
                        <Text className="text-lg font-semibold text-gray-900">Thông tin người dùng</Text>
                    </View>

                    {/* Phần thông tin cá nhân - Avatar và tên người dùng */}
                    <View className="items-center pt-8 pb-6 border-b border-gray-100">
                        <Image
                            source={{uri: selectedChat.avatarUrl || 'https://placehold.co/96x96/0068FF/FFFFFF/png'}}
                            className="w-24 h-24 rounded-full mb-4"
                        />
                        <Text
                            className="text-xl font-semibold text-gray-900">{selectedChat.name || 'Chưa có tên'}</Text>
                        <Text className="text-sm text-gray-500 mt-1">{selectedChat.participantIds[0] || 'null'}</Text>
                    </View>

                    {/* Phần actions - Các nút tương tác chính */}
                    <View className="flex-row justify-around py-4 border-b border-gray-100">
                        {/* Nút xem profile */}
                        <TouchableOpacity className="items-center">
                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
                                <Ionicons name="person-outline" size={20} color="#666"/>
                            </View>
                            <Text className="text-sm text-gray-600">Profile</Text>
                        </TouchableOpacity>

                        {/* Nút tắt thông báo */}
                        <TouchableOpacity className="items-center">
                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
                                <Ionicons name="notifications-off-outline" size={20} color="#666"/>
                            </View>
                            <Text className="text-sm text-gray-600">Mute</Text>
                        </TouchableOpacity>

                        {/* Nút tìm kiếm */}
                        <TouchableOpacity className="items-center" onPress={handleSearchPress}>
                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
                                <Ionicons name="search-outline" size={20} color="#666"/>
                            </View>
                            <Text className="text-sm text-gray-600">Search</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Phần media - Hiển thị ảnh và video đã chia sẻ */}
                    <View className="p-4 border-b border-gray-100">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-base font-medium">Ảnh/Video</Text>
                            <TouchableOpacity>
                                <Text className="text-blue-500">Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Grid hiển thị ảnh/video */}
                        <View className="flex-row flex-wrap">
                            {[1, 2, 3, 4].map((item) => (
                                <View key={item} className="w-[48%] aspect-square bg-gray-100 rounded-lg m-1"/>
                            ))}
                        </View>
                    </View>

                    {/* Phần files - Hiển thị các file đã chia sẻ */}
                    <View className="p-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-base font-medium">File</Text>
                            <TouchableOpacity>
                                <Text className="text-blue-500">Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Item file mẫu */}
                        <View className="bg-gray-50 p-3 rounded-lg flex-row items-center mb-2">
                            <Ionicons name="document-outline" size={24} color="#666"/>
                            <View className="ml-3">
                                <Text className="text-gray-900">Document.pdf</Text>
                                <Text className="text-gray-500 text-sm">123 KB</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Component Search - Hiển thị modal tìm kiếm */}
                <Search
                    isVisible={isSearchVisible}
                    onClose={() => setIsSearchVisible(false)}
                    conversationId={selectedChat.id}
                />
            </View>
        );
    }

    // Giao diện cho chat nhóm
    return (
        <View className="flex-1 bg-white border-l border-gray-200">
            <ScrollView className="flex-1">
                {/* Header - Hiển thị tiêu đề phần thông tin */}
                <View className="h-14 px-4 border-b border-gray-200 flex-row items-center">
                    {onBackPress && (
                        <TouchableOpacity onPress={onBackPress} className="mr-3">
                            <Ionicons name="arrow-back" size={24} color="#666" />
                        </TouchableOpacity>
                    )}
                    <Text className="text-lg font-semibold text-gray-900">Thông tin nhóm</Text>
                </View>

                {/* Phần thông tin nhóm - Avatar, tên và số lượng thành viên */}
                <View className="items-center pt-8 pb-6 border-b border-gray-100">
                    <Image
                        source={{uri: selectedChat.avatarUrl || 'https://placehold.co/96x96/0068FF/FFFFFF/png'}}
                        className="w-24 h-24 rounded-full mb-4"
                    />
                    <Text className="text-xl font-semibold text-gray-900">{selectedChat.name || 'Chưa có tên'}</Text>
                    <Text className="text-sm text-gray-500 mt-1">{selectedChat.participantIds.length} thành viên</Text>
                </View>

                {/* Phần actions - Các nút tương tác chính */}
                <View className="flex-row justify-between py-4 px-8 border-b border-gray-100">
                    {/* Actions bên trái */}
                    <View className="flex-row space-x-8">
                        {/* Nút tắt thông báo */}
                        <TouchableOpacity className="items-center">
                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
                                <Ionicons name="notifications-off-outline" size={20} color="#666"/>
                            </View>
                            <Text className="text-sm text-gray-600">Mute</Text>
                        </TouchableOpacity>

                        {/* Nút tìm kiếm */}
                        <TouchableOpacity className="items-center" onPress={handleSearchPress}>
                            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
                                <Ionicons name="search-outline" size={20} color="#666"/>
                            </View>
                            <Text className="text-sm text-gray-600">Search</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Nút báo cáo - Đặt bên phải */}
                    <TouchableOpacity className="items-center">
                        <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mb-1">
                            <Ionicons name="flag-outline" size={20} color="#666"/>
                        </View>
                        <Text className="text-sm text-gray-600">Báo cáo</Text>
                    </TouchableOpacity>
                </View>

                {/* Phần media - Hiển thị ảnh và video đã chia sẻ */}
                <View className="p-4 border-b border-gray-100">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-base font-medium">Ảnh/Video</Text>
                        <TouchableOpacity>
                            <Text className="text-blue-500">Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Grid hiển thị ảnh/video */}
                    <View className="flex-row flex-wrap">
                        {[1, 2, 3, 4].map((item) => (
                            <View key={item} className="w-[48%] aspect-square bg-gray-100 rounded-lg m-1"/>
                        ))}
                    </View>
                </View>

                {/* Phần files - Hiển thị các file đã chia sẻ */}
                <View className="p-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-base font-medium">File</Text>
                        <TouchableOpacity>
                            <Text className="text-blue-500">Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Item file mẫu */}
                    <View className="bg-gray-50 p-3 rounded-lg flex-row items-center mb-2">
                        <Ionicons name="document-outline" size={24} color="#666"/>
                        <View className="ml-3">
                            <Text className="text-gray-900">Document.pdf</Text>
                            <Text className="text-gray-500 text-sm">123 KB</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Component Search - Hiển thị modal tìm kiếm */}
            <Search
                isVisible={isSearchVisible}
                onClose={() => setIsSearchVisible(false)}
                conversationId={selectedChat.id}
            />
        </View>
    );
}