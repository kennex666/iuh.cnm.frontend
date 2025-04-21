import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Conversation } from '@/src/models/Conversation';
import Search from './Search';
import HeaderInfo from '../info/HeaderInfo';
import ProfileInfo from '../info/ProfileInfo';
import ActionsInfo from '../info/ActionsInfo';
import MediaInfo from '../info/MediaInfo';
import FilesInfo from '../info/FilesInfo';
import { Ionicons } from '@expo/vector-icons';
import GroupInfo from '../info/GroupInfo';

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

    return (
        <View className="flex-1 bg-white">
            <HeaderInfo 
                isGroup={selectedChat.isGroup} 
                onBackPress={onBackPress} 
            />
            <ScrollView className="flex-1">
                <ProfileInfo
                    avatar={selectedChat.avatar}
                    name={selectedChat.name}
                    isGroup={selectedChat.isGroup}
                    memberCount={selectedChat.participants?.length}
                    isOnline={!selectedChat.isGroup}
                />
                <ActionsInfo
                    isGroup={selectedChat.isGroup}
                    onSearchPress={handleSearchPress}
                />
                {selectedChat.isGroup && (
                    <GroupInfo
                        group={selectedChat}
                    />
                )}
                <MediaInfo
                    images={MOCK_IMAGES}
                />
                <FilesInfo
                    files={MOCK_FILES}
                />
            </ScrollView>

            <Search
                isVisible={isSearchVisible}
                onClose={() => setIsSearchVisible(false)}
                conversationId={selectedChat.id}
            />
        </View>
    );
}