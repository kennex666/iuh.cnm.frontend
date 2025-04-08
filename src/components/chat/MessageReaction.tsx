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

// Props của component MessageReaction
interface MessageReactionProps {
  messageId: string;      // ID của tin nhắn cần thả reaction
  isVisible: boolean;     // Trạng thái hiển thị của menu reaction
  onReact: (messageId: string, reactionId: string) => void;  // Callback khi chọn reaction
  onToggle: () => void;  // Callback để ẩn/hiện menu reaction
  isSender: boolean;     // Có phải là người gửi không
}

export default function MessageReaction({ messageId, isVisible, onReact, onToggle, isSender }: MessageReactionProps) {
  return (
    <View className="relative">
      {/* Nút reaction chính - hiển thị trái tim màu xám */}
      <TouchableOpacity 
        onPress={onToggle} 
        className="mt-1 p-1 rounded-full hover:bg-gray-100 active:bg-gray-200"
      >
        <FontAwesome name="heart" size={12} color="#999999" />
      </TouchableOpacity>

      {/* Menu reaction - chỉ hiển thị khi isVisible = true */}
      {isVisible && (
        <View 
          // Định vị menu:
          // - absolute + top-0: hiển thị từ trên xuống
          // - mt-6: tạo khoảng cách với nút chính để không bị che
          // - left/right-0: căn theo người gửi/nhận
          className={`absolute top-0 bg-white shadow-lg rounded-full py-1 px-2 mt-6 flex-row items-center ${
            isSender ? '-right-2' : '-left-2'
          }`}
        >
          {/* Map qua danh sách reaction để tạo các nút */}
          {REACTIONS.map((reaction) => (
            <TouchableOpacity 
              key={reaction.id}
              onPress={() => {
                onReact(messageId, reaction.id); // Gọi callback với messageId và reactionId
                onToggle(); // Đóng menu sau khi chọn
              }}
              className="mx-1 p-1 hover:bg-gray-50 active:scale-110 transition-transform rounded-full"
            >
              <FontAwesome name={reaction.icon} size={16} color={reaction.color} />
            </TouchableOpacity>
          ))}
          {/* Nút thêm reaction - có thể mở rộng tính năng sau */}
          <TouchableOpacity className="mx-1 p-1 hover:bg-gray-50 active:scale-110 transition-transform rounded-full">
            <FontAwesome name="plus" size={14} color="#999999" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
} 