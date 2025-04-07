import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const REACTIONS = [
  { id: '1', icon: 'heart', color: '#E31B23' },      // Màu đỏ cho trái tim
  { id: '2', icon: 'smile-o', color: '#FFD93B' },    // Màu vàng cho nụ cười
  { id: '3', icon: 'meh-o', color: '#FFD93B' },      // Màu vàng cho mặt thường
  { id: '4', icon: 'frown-o', color: '#FFD93B' },    // Màu vàng cho mặt buồn
  { id: '5', icon: 'thumbs-up', color: '#FFB800' },  // Màu cam cho like
] as const;

interface MessageReactionProps {
  messageId: string;      // ID của tin nhắn cần thả reaction
  isVisible: boolean;     // Trạng thái hiển thị của menu reaction
  onReact: (messageId: string, reactionId: string) => void;  // Callback khi chọn reaction
  onToggle: () => void;  // Callback để ẩn/hiện menu reaction
}

export default function MessageReaction({ messageId, isVisible, onReact, onToggle }: MessageReactionProps) {
  return (
    <View>
      {/* Nút hiển thị menu reaction */}
      <TouchableOpacity 
        onPress={onToggle} 
        className="mt-1 p-1.5"
      >
        <FontAwesome name="heart" size={14} color="#999999" />
      </TouchableOpacity>

      {/* Menu chọn reaction - hiển thị khi isVisible = true */}
      {isVisible && (
        <View className="absolute bottom-full left-0 bg-white shadow-xl rounded-full py-2 px-3 z-50 mb-2 flex-row items-center">
          {REACTIONS.map((reaction) => (
            <TouchableOpacity 
              key={reaction.id}
              onPress={() => {
                onReact(messageId, reaction.id);
                onToggle();
              }}
              className="mx-1.5 p-1 hover:bg-gray-50 active:scale-110 transition-transform rounded-full"
            >
              <FontAwesome name={reaction.icon} size={20} color={reaction.color} />
            </TouchableOpacity>
          ))}
          {/* Nút thêm reaction (có thể mở rộng tính năng sau) */}
          <TouchableOpacity className="mx-1.5 p-1 hover:bg-gray-50 active:scale-110 transition-transform rounded-full">
            <FontAwesome name="plus" size={16} color="#999999" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
} 