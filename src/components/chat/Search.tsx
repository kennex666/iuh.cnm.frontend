import React, {useState} from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, View, Dimensions} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

// Props interface cho component Search
interface SearchProps {
    isVisible: boolean;      // Điều khiển hiển thị/ẩn component
    onClose: () => void;     // Callback function khi đóng search
    conversationId: string;  // ID của cuộc trò chuyện hiện tại
}

interface SearchResult {
    type: 'message' | 'file' | 'image';  // Loại kết quả
    title: string;                       // Tiêu đề/nội dung
    subtitle?: string;                   // Thông tin phụ (optional)
    timestamp: string;                   // Thời gian
    url?: string;                        // Đường dẫn đến file/image (optional)
}

export default function Search({isVisible, onClose, conversationId}: SearchProps) {
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'messages' | 'files' | 'media'>('all');

    // Mock data cho demo
    const mockResults: SearchResult[] = [
        {
            type: 'message',
            title: 'Xin chào mọi người',
            timestamp: '12:30',
        },
        {
            type: 'file',
            title: 'Document.pdf',
            subtitle: '123 KB',
            timestamp: 'Hôm qua',
            url: '#',
        },
        {
            type: 'image',
            title: 'Image_001.jpg',
            timestamp: '23/03/2024',
            url: 'https://placehold.co/96x96/png',
        },
    ];

    if (!isVisible) return null;

    return (
        <View className="absolute inset-0 bg-white z-50">
            {/* Header với thanh tìm kiếm */}
            <View className="h-16 px-4 border-b border-blue-100 flex-row items-center justify-between bg-white">
                {/* Search input container */}
                <View className="flex-1 flex-row items-center bg-blue-50 rounded-xl px-4 py-2.5 mr-4">
                    <Ionicons name="search-outline" size={20} color="#3B82F6"/>
                    <TextInput
                        className="flex-1 ml-2 text-base text-blue-950"
                        placeholder="Tìm kiếm trong cuộc trò chuyện"
                        placeholderTextColor="#3B82F6"
                        value={searchText}
                        onChangeText={setSearchText}
                        autoFocus
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity 
                            onPress={() => setSearchText('')}
                            className="p-1 rounded-full active:bg-blue-100"
                        >
                            <Ionicons name="close-circle" size={20} color="#3B82F6"/>
                        </TouchableOpacity>
                    )}
                </View>
                {/* Nút đóng search */}
                <TouchableOpacity 
                    onPress={onClose}
                    className="py-2 px-4 rounded-lg active:bg-blue-50"
                >
                    <Text className="text-blue-500 font-medium">Đóng</Text>
                </TouchableOpacity>
            </View>

            {/* Tabs để lọc kết quả */}
            <View className="flex-row border-b border-blue-100">
                {['all', 'messages', 'files', 'media'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab as any)}
                        className={`flex-1 py-3 ${
                            activeTab === tab 
                                ? 'border-b-2 border-blue-500 bg-blue-50/50' 
                                : ''
                        }`}
                    >
                        <Text className={`text-center ${
                            activeTab === tab 
                                ? 'text-blue-500 font-medium' 
                                : 'text-blue-900'
                        }`}>
                            {tab === 'all' && 'Tất cả'}
                            {tab === 'messages' && 'Tin nhắn'}
                            {tab === 'files' && 'Files'}
                            {tab === 'media' && 'Media'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Khu vực kết quả tìm kiếm */}
            <ScrollView className="flex-1 bg-white">
                {searchText.length > 0 ? (
                    mockResults
                        .filter(result => {
                            if (activeTab === 'all') return true;
                            if (activeTab === 'messages') return result.type === 'message';
                            if (activeTab === 'files') return result.type === 'file';
                            if (activeTab === 'media') return result.type === 'image';
                            return true;
                        })
                        .map((result, index) => (
                            <TouchableOpacity
                                key={index}
                                className="flex-row items-center px-4 py-3 border-b border-blue-100 active:bg-blue-50"
                            >
                                {/* Icon hoặc thumbnail */}
                                {result.type === 'message' && (
                                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                                        <Ionicons name="chatbubble-outline" size={20} color="#3B82F6"/>
                                    </View>
                                )}
                                {result.type === 'file' && (
                                    <View className="w-10 h-10 rounded-lg bg-blue-100 items-center justify-center">
                                        <Ionicons name="document-outline" size={20} color="#3B82F6"/>
                                    </View>
                                )}
                                {result.type === 'image' && (
                                    <Image
                                        source={{uri: result.url}}
                                        className="w-10 h-10 rounded-lg border border-blue-100"
                                    />
                                )}

                                {/* Nội dung */}
                                <View className="flex-1 ml-3">
                                    <Text className="text-blue-950 font-medium">{result.title}</Text>
                                    {result.subtitle && (
                                        <Text className="text-blue-500 text-sm">{result.subtitle}</Text>
                                    )}
                                </View>

                                {/* Thời gian */}
                                <Text className="text-blue-500 text-sm">{result.timestamp}</Text>
                            </TouchableOpacity>
                        ))
                ) : (
                    <View className="flex-1 items-center justify-center py-8">
                        <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mb-4">
                            <Ionicons name="search-outline" size={32} color="#3B82F6"/>
                        </View>
                        <Text className="text-blue-900 text-center">
                            Nhập từ khóa để tìm kiếm{'\n'}
                            trong cuộc trò chuyện
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
} 