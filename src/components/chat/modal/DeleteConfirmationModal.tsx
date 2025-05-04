import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Message} from "@/src/models/Message";

interface DeleteConfirmationModalProps {
    messageToDelete: Message;
    onConfirmDelete: () => void;
    onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = (
    {
        messageToDelete,
        onConfirmDelete,
        onCancel
    }) => {
    return (
        <View className="absolute inset-0 bg-black/30 items-center justify-center">
            <View className="bg-white rounded-2xl w-[90%] max-w-md overflow-hidden shadow-lg">
                <View className="p-6 items-center">
                    <View className="w-16 h-16 rounded-full bg-red-50 items-center justify-center mb-4">
                        <Ionicons name="trash" size={32} color="#EF4444"/>
                    </View>
                    <Text className="text-xl font-semibold text-gray-800 mb-2">
                        Xóa tin nhắn
                    </Text>
                    <Text className="text-gray-600 text-center">
                        Bạn có chắc chắn muốn xóa tin nhắn này?{"\n"}
                        Hành động này không thể hoàn tác.
                    </Text>
                </View>
                <View className="flex-row p-4 border-t border-gray-100">
                    <TouchableOpacity
                        className="flex-1 mr-2 h-12 rounded-xl bg-gray-100 items-center justify-center active:bg-gray-200"
                        onPress={onCancel}
                    >
                        <Text className="text-gray-800 font-medium">Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-1 h-12 rounded-xl bg-red-500 items-center justify-center active:bg-red-600"
                        onPress={onConfirmDelete}
                    >
                        <Text className="text-white font-medium">Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default DeleteConfirmationModal;