import React from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'

interface EmojiPickerProps {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  toggleModelEmoji: () => void;
}

const EMOJI_CATEGORIES = [
  {
    name: 'Cảm xúc',
    emojis: ['😀', '😂', '😊', '😍', '😎', '😘', '😜', '😢']
  },
  {
    name: 'Động vật',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']
  },
  {
    name: 'Thức ăn',
    emojis: ['🍎', '🍕', '🍔', '🍟', '🍦', '🍩', '🍪', '🍫']
  },
  {
    name: 'Hoạt động',
    emojis: ['⚽', '🏀', '🎮', '🎨', '🎵', '🎬', '🎭', '🎪']
  },
  {
    name: 'Du lịch',
    emojis: ['🚗', '✈️', '🚢', '🚀', '🏖️', '🏝️', '🏰', '🗽']
  }
];

export default function EmojiPicker({ setMessage, toggleModelEmoji }: EmojiPickerProps) {
  return (
    <View className="p-4">
      <Text className="text-gray-800 mb-2">Chọn biểu tượng cảm xúc</Text>
      <ScrollView className="max-h-[300px]">
        {EMOJI_CATEGORIES.map((category, index) => (
          <View key={index} className="mb-4">
            <Text className="font-semibold text-gray-700 mb-2">{category.name}</Text>
            <View className="flex-row flex-wrap">
              {category.emojis.map((emoji, emojiIndex) => (
                <TouchableOpacity
                  key={emojiIndex}
                  className="w-1/8 p-2 items-center justify-center"
                  onPress={() => {
                    setMessage(prev => prev + emoji);
                    toggleModelEmoji();
                  }}
                >
                  <Text className="text-2xl">{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
