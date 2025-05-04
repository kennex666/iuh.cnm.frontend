import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Message} from "@/src/models/Message";

interface MessageOptionsModalProps {
    selectedMessage: Message;
    messageUsers: { [key: string]: any };
    currentUserId?: string;
    onClose: () => void;
    onReply: (message: Message) => void;
    onForward: (message: Message) => void;
    onPin: (message: Message) => void;
    onDelete: (message: Message) => void;
}

const MessageOptionsModal: React.FC<MessageOptionsModalProps> = (
    {
        selectedMessage,
        messageUsers,
        currentUserId,
        onClose,
        onReply,
        onForward,
        onPin,
        onDelete
    }) => {
    return (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <View className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden shadow-lg">
                {/* Modal content */}
                <View className="p-4 border-b border-gray-100">
                    <View className="flex-row items-center">
                        <Image
                            source={{
                                uri: messageUsers[selectedMessage.senderId]?.avatarURL ||
                                    "https://placehold.co/40x40/0068FF/FFFFFF/png?text=G",
                            }}
                            className="w-10 h-10 rounded-full"
                            resizeMode="cover"
                        />
                        <View className="ml-3 flex-1">
                            <Text className="text-gray-800 font-medium">
                                {messageUsers[selectedMessage.senderId]?.name}
                            </Text>
                            <Text className="text-gray-500 text-sm">
                                {new Date(selectedMessage.sentAt).toLocaleString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </Text>
                        </View>
                    </View>
                    <View className="mt-3 bg-gray-50 rounded-lg p-3">
                        <Text className="text-gray-800">{selectedMessage.content}</Text>
                    </View>
                </View>

                <View className="divide-y divide-gray-100">
                    <TouchableOpacity
                        className="flex-row items-center p-4 active:bg-gray-50"
                        onPress={() => onReply(selectedMessage)}
                    >
                        <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                            <Ionicons name="return-up-back" size={20} color="#3B82F6"/>
                        </View>
                        <Text className="ml-3 text-gray-800">Trả lời</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center p-4 active:bg-gray-50"
                        onPress={() => onForward(selectedMessage)}
                    >
                        <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                            <Ionicons name="arrow-redo" size={20} color="#3B82F6"/>
                        </View>
                        <Text className="ml-3 text-gray-800">Chuyển tiếp</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center p-4 active:bg-gray-50"
                        onPress={() => onPin(selectedMessage)}
                    >
                        <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                            <Ionicons name="pin" size={20} color="#3B82F6"/>
                        </View>
                        <Text className="ml-3 text-gray-800">Ghim tin nhắn</Text>
                    </TouchableOpacity>

                    {selectedMessage.senderId === currentUserId && (
                        <TouchableOpacity
                            className="flex-row items-center p-4 active:bg-gray-50"
                            onPress={() => onDelete(selectedMessage)}
                        >
                            <View className="w-8 h-8 rounded-full bg-red-50 items-center justify-center">
                                <Ionicons name="trash" size={20} color="#EF4444"/>
                            </View>
                            <Text className="ml-3 text-red-500">Xóa tin nhắn</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
                    onPress={onClose}
                >
                    <Ionicons name="close" size={20} color="#666"/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MessageOptionsModal;