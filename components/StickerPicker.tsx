import React, { useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, TextInput, Image, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

interface Category {
  id: string;
  icon: string;
  name: string;
  color: string;
}

interface StickerPickerProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  toggleModelSticker: () => void;
}

const STICKER_CATEGORIES = [
  {
    id: 'happy',
    icon: '😊',
    name: 'Happy',
    color: '#FFD700', // Gold
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/happy/${i + 1}.png`)
  },
  {
    id: 'love',
    icon: '❤️',
    name: 'In Love',
    color: '#FF69B4', // Pink
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/love/${i + 1}.png`)
  },
  {
    id: 'sad',
    icon: '😢',
    name: 'Sad',
    color: '#A9A9A9', // Dark Gray
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/sad/${i + 1}.png`)
  },
  {
    id: 'eating',
    icon: '🍽️',
    name: 'Eating',
    color: '#FFA500', // Orange
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/eating/${i + 1}.png`)
  },
  {
    id: 'celebrating',
    icon: '🎉',
    name: 'Celebrating',
    color: '#90EE90', // Light Green
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/celebrating/${i + 1}.png`)
  },
  {
    id: 'active',
    icon: '⚡',
    name: 'Active',
    color: '#87CEEB', // Sky Blue
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/active/${i + 1}.png`)
  },
  {
    id: 'working',
    icon: '💼',
    name: 'Working',
    color: '#20B2AA', // Light Sea Green
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/working/${i + 1}.png`)
  },
  {
    id: 'sleepy',
    icon: '😴',
    name: 'Sleepy',
    color: '#9370DB', // Medium Purple
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/sleepy/${i + 1}.png`)
  },
  {
    id: 'angry',
    icon: '😠',
    name: 'Angry',
    color: '#FF6347', // Tomato
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/angry/${i + 1}.png`)
  },
  {
    id: 'confused',
    icon: '😕',
    name: 'Confused',
    color: '#DEB887', // Burly Wood
    stickers: Array.from({ length: 8 }, (_, i) => `/assets/stickers/confused/${i + 1}.png`)
  }
];

export default function StickerPicker({ setMessage, toggleModelSticker }: StickerPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { width } = useWindowDimensions();
  
  // Tính toán kích thước container dựa trên màn hình
  const containerWidth = Math.min(width * 0.9, 400); // Giới hạn max width là 400px
  
  // Filter categories based on search
  const filteredCategories = STICKER_CATEGORIES.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chia categories thành 2 cột
  const leftColumn = filteredCategories.filter((_, i) => i % 2 === 0);
  const rightColumn = filteredCategories.filter((_, i) => i % 2 === 1);

  const renderCategoryButton = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      className="mb-2 px-3 py-2 rounded-lg flex-1"
      style={{ backgroundColor: category.color + '15' }}
    >
      <View className="flex-row items-center justify-start space-x-2">
        <Text className="text-base">{category.icon}</Text>
        <Text className="text-sm font-medium text-gray-700" numberOfLines={1}>
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ width: containerWidth }} className="bg-white rounded-lg shadow-lg">
      {/* Search Bar */}
      <View className="p-2 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-2 py-1">
          <Ionicons name="search-outline" size={14} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-sm text-gray-800"
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {/* Sticker Categories */}
      <ScrollView className="max-h-[300px]">
        <View className="p-2">
          <View className="flex-row space-x-2">
            {/* Left Column */}
            <View className="flex-1 space-y-2">
              {leftColumn.map(renderCategoryButton)}
            </View>
            
            {/* Right Column */}
            <View className="flex-1 space-y-2">
              {rightColumn.map(renderCategoryButton)}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 