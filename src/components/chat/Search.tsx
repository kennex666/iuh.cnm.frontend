import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

export default function Search({ isVisible, onClose, conversationId }: SearchProps) {
  // State quản lý
  const [searchText, setSearchText] = useState('');  // Text người dùng nhập để tìm kiếm
  const [activeTab, setActiveTab] = useState<'all' | 'messages' | 'files' | 'media'>('all');  // Tab đang được chọn

  // Mock data  thay thế bằng dữ liệu thực từ API sau này
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
      url: 'https://placehold.co/96x96/0068FF/FFFFFF/png',
    },
  ];

  // Không hiển thị nếu isVisible = false
  if (!isVisible) return null;

  return (
    // Container chính với position absolute để overlay lên trên content
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-white z-50">
      {/* Header chứa thanh tìm kiếm và nút đóng */}
      <View className="h-14 px-4 border-b border-gray-200 flex-row items-center justify-between">
        {/* Search input container */}
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-4">
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Tìm kiếm trong cuộc trò chuyện"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {/* Nút xóa text chỉ hiển thị khi có text */}
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {/* Nút đóng search */}
        <TouchableOpacity onPress={onClose}>
          <Text className="text-blue-500">Đóng</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs để lọc kết quả theo loại */}
      <View className="flex-row border-b border-gray-200">
        {['all', 'messages', 'files', 'media'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 ${activeTab === tab ? 'border-b-2 border-blue-500' : ''}`}
          >
            <Text
              className={`text-center ${
                activeTab === tab ? 'text-blue-500 font-medium' : 'text-gray-600'
              }`}
            >
              {tab === 'all' && 'Tất cả'}
              {tab === 'messages' && 'Tin nhắn'}
              {tab === 'files' && 'Files'}
              {tab === 'media' && 'Media'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Khu vực hiển thị kết quả tìm kiếm */}
      <ScrollView className="flex-1">
        {searchText.length > 0 ? (
          // Lọc và hiển thị kết quả dựa trên tab đang active 
          // Lọc kết quả dựa trên tab đang active
          mockResults.filter((result) => {
              if (activeTab === 'all') return true;
              if (activeTab === 'messages') return result.type === 'message';
              if (activeTab === 'files') return result.type === 'file';
              if (activeTab === 'media') return result.type === 'image';
              return true;
            })
            .map((result, index) => (
              // Item kết quả tìm kiếm
              <TouchableOpacity
                key={index}
                className="flex-row items-center px-4 py-3 border-b border-gray-100"
              >
                {/* Icon hoặc thumbnail tùy theo loại kết quả */}
                {result.type === 'message' && (
                  <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                    <Ionicons name="chatbubble-outline" size={20} color="#666" />
                  </View>
                )}
                {result.type === 'file' && (
                  <View className="w-10 h-10 rounded-lg bg-gray-100 items-center justify-center">
                    <Ionicons name="document-outline" size={20} color="#666" />
                  </View>
                )}
                {result.type === 'image' && (
                  <Image
                    source={{ uri: result.url }}
                    className="w-10 h-10 rounded-lg"
                  />
                )}

                {/* Nội dung kết quả */}
                <View className="flex-1 ml-3">
                  <Text className="text-gray-900 font-medium">{result.title}</Text>
                  {result.subtitle && (
                    <Text className="text-gray-500 text-sm">{result.subtitle}</Text>
                  )}
                </View>

                {/* Thời gian */}
                <Text className="text-gray-500 text-sm">{result.timestamp}</Text>
              </TouchableOpacity>
            ))
        ) : (
          // Hiển thị khi chưa nhập từ khóa tìm kiếm
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500">Nhập từ khóa để tìm kiếm</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 