import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Conversation } from '@/src/models/Conversation';
import Search from './Search';

// Mockup data cho ảnh đã chia sẻ
const MOCK_IMAGES = [
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60',
];

// Mockup data cho files đã chia sẻ
const MOCK_FILES = [
    {
        name: 'Project_Presentation.pdf',
        size: '2.5 MB',
        type: 'pdf',
        date: '15/02/2024'
    },
    {
        name: 'Meeting_Notes.docx',
        size: '856 KB',
        type: 'docx',
        date: '14/02/2024'
    },
    {
        name: 'Budget_2024.xlsx',
        size: '1.2 MB',
        type: 'xlsx',
        date: '13/02/2024'
    },
    {
        name: 'Assets.zip',
        size: '5.7 MB',
        type: 'zip',
        date: '12/02/2024'
    }
];

// Props interface cho component Info
export interface InfoProps {
    selectedChat: Conversation | null;
    onBackPress?: () => void;
}

export default function Info({ selectedChat, onBackPress }: InfoProps) {
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const handleSearchPress = () => {
        setIsSearchVisible(true);
    };

    // Helper function để lấy icon cho từng loại file
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return 'document-text-outline';
            case 'docx':
                return 'document-outline';
            case 'xlsx':
                return 'grid-outline';
            case 'zip':
                return 'folder-outline';
            default:
                return 'document-outline';
        }
    };

    // Hiển thị placeholder khi chưa chọn cuộc trò chuyện
    if (!selectedChat) {
        return (
            <View className="flex-1 items-center justify-center bg-blue-50/50 rounded-2xl m-4">
                <View className="bg-white p-6 rounded-2xl shadow-sm items-center">
                    <Ionicons name="chatbubble-ellipses-outline" size={48} color="#3B82F6" />
                    <Text className="text-blue-900 mt-4 text-center">
                        Chọn một cuộc trò chuyện để xem thông tin chi tiết
                    </Text>
                </View>
            </View>
        );
    }

    const renderHeader = () => (
        <View className="h-16 px-6 border-b border-blue-100 flex-row items-center justify-between bg-white">
            <View className="flex-row items-center">
                {onBackPress && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        className="mr-4 w-9 h-9 bg-blue-50 rounded-full items-center justify-center active:bg-blue-100"
                    >
                        <Ionicons name="chevron-back" size={24} color="#3B82F6" />
                    </TouchableOpacity>
                )}
                <Text className="text-[17px] font-semibold text-blue-950">
                    {selectedChat.isGroup ? 'Thông tin nhóm' : 'Thông tin người dùng'}
                </Text>
            </View>
        </View>
    );

    const renderProfile = () => (
        <View className="items-center pt-8 pb-6">
            <View className="mb-4 relative">
                <View className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-100 to-blue-200 items-center justify-center">
                    <Image
                        source={{ uri: selectedChat.avatar || 'https://placehold.co/96x96/png' }}
                        className="w-24 h-24 rounded-full border-[2.5px] border-white"
                    />
                </View>
                {!selectedChat.isGroup && (
                    <View className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-[2.5px] border-white shadow-sm" />
                )}
            </View>
            <Text className="text-[17px] font-semibold text-blue-950">
                {selectedChat.name || 'Chưa có tên'}
            </Text>
            <Text className="text-sm text-blue-500 mt-1">
                {selectedChat.isGroup
                    ? `${selectedChat.participants?.length || 0} thành viên`
                    : 'Đang hoạt động'}
            </Text>
        </View>
    );

    const renderActions = () => (
        <View className={`flex-row ${selectedChat.isGroup ? 'justify-between px-8' : 'justify-around'} py-4 border-y border-blue-100`}>
            {/* Actions chung */}
            <TouchableOpacity className="items-center">
                <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                    <Ionicons name="notifications-off-outline" size={22} color="#3B82F6" />
                </View>
                <Text className="text-sm text-blue-900">Tắt thông báo</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={handleSearchPress}>
                <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                    <Ionicons name="search-outline" size={22} color="#3B82F6" />
                </View>
                <Text className="text-sm text-blue-900">Tìm kiếm</Text>
            </TouchableOpacity>

            {selectedChat.isGroup ? (
                <TouchableOpacity className="items-center">
                    <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                        <Ionicons name="flag-outline" size={22} color="#3B82F6" />
                    </View>
                    <Text className="text-sm text-blue-900">Báo cáo</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity className="items-center">
                    <View className="w-12 h-12 bg-blue-50 rounded-xl items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                        <Ionicons name="person-outline" size={22} color="#3B82F6" />
                    </View>
                    <Text className="text-sm text-blue-900">Xem profile</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const renderMedia = () => (
        <View className="px-4 pt-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-medium text-blue-950">Ảnh/Video đã chia sẻ</Text>
                <TouchableOpacity className="py-1 px-3 rounded-lg bg-blue-50 active:bg-blue-100">
                    <Text className="text-blue-500">Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap -mx-1">
                {MOCK_IMAGES.slice(0, 6).map((uri, index) => (
                    <TouchableOpacity
                        key={index}
                        className="w-[32%] aspect-square p-1"
                    >
                        <Image
                            source={{ uri }}
                            className="w-full h-full rounded-xl border border-blue-100"
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderFiles = () => (
        <View className="px-4 pt-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-medium text-blue-950">File đã chia sẻ</Text>
                <TouchableOpacity className="py-1 px-3 rounded-lg bg-blue-50 active:bg-blue-100">
                    <Text className="text-blue-500">Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <View className="space-y-2">
                {MOCK_FILES.map((file, index) => (
                    <View key={index} className="bg-blue-50/50 p-3.5 rounded-xl flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                                <Ionicons name={getFileIcon(file.type)} size={20} color="#3B82F6" />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-[15px] text-blue-950" numberOfLines={1}>
                                    {file.name}
                                </Text>
                                <View className="flex-row items-center mt-0.5">
                                    <Text className="text-sm text-blue-500">{file.size}</Text>
                                    <Text className="text-sm text-blue-400 mx-1.5">•</Text>
                                    <Text className="text-sm text-blue-500">{file.date}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity className="w-9 h-9 bg-blue-100 rounded-lg items-center justify-center ml-3 active:bg-blue-200">
                            <Ionicons name="download-outline" size={18} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {renderHeader()}
            <ScrollView className="flex-1">
                {renderProfile()}
                {renderActions()}
                {renderMedia()}
                {renderFiles()}
            </ScrollView>

            <Search
                isVisible={isSearchVisible}
                onClose={() => setIsSearchVisible(false)}
                conversationId={selectedChat.id}
            />
        </View>
    );
}