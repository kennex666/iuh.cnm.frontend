import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {Shadows} from '@/src/styles/Shadow';

const REACTIONS = [
    {id: '1', icon: 'heart', color: '#E31B23'},      // Màu đỏ cho trái tim
    {id: '2', icon: 'smile-o', color: '#FFD93B'},    // Màu vàng cho nụ cười
    {id: '3', icon: 'meh-o', color: '#FFD93B'},      // Màu vàng cho mặt thường
    {id: '4', icon: 'frown-o', color: '#FFD93B'},    // Màu vàng cho mặt buồn
    {id: '5', icon: 'thumbs-up', color: '#FFB800'},  // Màu cam cho like
] as const;

// Props của component MessageReaction
interface MessageReactionProps {
    messageId: string;      // ID của tin nhắn cần thả reaction
    isVisible: boolean;     // Trạng thái hiển thị của menu reaction
    onReact: (messageId: string, reactionId: string) => void;  // Callback khi chọn reaction
    onToggle: () => void;  // Callback để ẩn/hiện menu reaction
    isSender: boolean;     // Có phải là người gửi không
}

export default function MessageReaction({messageId, isVisible, onReact, onToggle, isSender}: MessageReactionProps) {
    return (
		<View
			className={`absolute z-50`}
			style={
				isSender
					? {
							left: -14,
							bottom: -10,
					  }
					: { right: -14, bottom: -10 }
			}
		>
			{/* Nút reaction chính - hiển thị trái tim màu xám */}
			<TouchableOpacity
				onPress={onToggle}
				className="rounded-full bg-gray-50 hover:bg-gray-100 border-gray-50 w-5 h-5 items-center justify-center"
			>
				<FontAwesome name="heart" size={10} color="#e3e3e3" />
			</TouchableOpacity>

			{/* Menu reaction - chỉ hiển thị khi isVisible = true */}
			{isVisible && (
				<View
					// Định vị menu:
					// - absolute + top-0: hiển thị từ trên xuống
					// - mt-6: tạo khoảng cách với nút chính để không bị che
					// - left/right-0: căn theo người gửi/nhận
					className={`absolute bottom-0 bg-white rounded-full py-1 px-2 mt-6 flex-row items-center ${
						isSender ? "right-6" : "left-6"
					}`}
					style={Shadows.lg}
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
							<FontAwesome
								name={reaction.icon}
								size={16}
								color={reaction.color}
							/>
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