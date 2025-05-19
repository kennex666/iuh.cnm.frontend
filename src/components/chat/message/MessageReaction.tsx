import React, { useState } from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Shadows} from '@/src/styles/Shadow';

const REACTIONS = [
    {id: '1', emoji: '❤️'},      // Tim
    {id: '2', emoji: '😊'},      // Mặt cười
    {id: '3', emoji: '😢'},      // Mặt khóc
    {id: '4', emoji: '😮'},      // Mặt ngạc nhiên
    {id: '5', emoji: '👍'},      // Like
    {id: '6', emoji: '😆'},      // Cười lớn
] as const;

// Props của component MessageReaction
interface MessageReactionProps {
    messageId: string;      // ID của tin nhắn cần thả reaction
    isVisible: boolean;     // Trạng thái hiển thị của menu reaction
    onReact: (messageId: string, reactionId: string) => void;  // Callback khi chọn reaction
    onToggle: () => void;  // Callback để ẩn/hiện menu reaction
    isSender: boolean;     // Có phải là người gửi không
    currentReaction?: string; // ID của reaction hiện tại
}

export default function MessageReaction({
    messageId, 
    isVisible, 
    onReact, 
    onToggle, 
    isSender,
    currentReaction
}: MessageReactionProps) {
    // Tìm emoji tương ứng với reaction hiện tại
    const currentEmoji = currentReaction 
        ? REACTIONS.find(r => r.id === currentReaction)?.emoji 
        : '🤍';

    return (
        <View
            className={`absolute bottom-0 top-[50%]`}
            style={
                isSender
                    ? {
                        left: -14,
                        bottom: -10,
                    }
                    : {right: -14, bottom: -10}
            }
        >
            {/* Nút reaction chính - hiển thị trái tim màu xám */}
            <TouchableOpacity
                onPress={onToggle}
                className="rounded-full bg-white hover:bg-gray-100 border border-gray-100 w-5 h-5 items-center justify-center"
                style={[
                    Shadows.sm,
                    {
                        elevation: 2,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 2,
                    }
                ]}
            >
                <Text className={`text-[10px] ${!currentReaction ? 'opacity-40' : ''}`}>
                    {currentEmoji}
                </Text>
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
                    style={[
                        Shadows.lg,
                        {
                            elevation: 8,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                        }
                    ]}
                >
                    {/* Map qua danh sách reaction để tạo các nút */}
                    {REACTIONS.map((reaction) => (
                        <TouchableOpacity
                            key={reaction.id}
                            onPress={() => {
                                onReact(messageId, reaction.id); // Gọi callback với messageId và reactionId
                                onToggle(); // Đóng menu sau khi chọn
                            }}
                            className={`mx-1 p-1 hover:bg-gray-50 active:scale-110 transition-transform rounded-full ${
                                currentReaction === reaction.id ? 'bg-gray-100' : ''
                            }`}
                        >
                            <Text className="text-base">{reaction.emoji}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
} 