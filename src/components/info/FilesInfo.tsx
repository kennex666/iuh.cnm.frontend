import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface File {
    name: string;
    size: string;
    type: string;
    date: string;
}

interface FilesInfoProps {
    files: File[];
    onViewAll?: () => void;
}

export default function FilesInfo({ files, onViewAll }: FilesInfoProps) {
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return 'document-text-outline';
            case 'docx':
                return 'document-outline';
            case 'xlsx':
                return 'grid-outline';
            case 'zip':
                return 'folder-outline';
            default:
                return 'document-outline';
        }
    };

    return (
        <View className="px-4 pt-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-medium text-blue-950">File đã chia sẻ</Text>
                <TouchableOpacity 
                    className="py-1 px-3 rounded-lg bg-blue-50 active:bg-blue-100"
                    onPress={onViewAll}
                >
                    <Text className="text-blue-500">Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <View className="space-y-2">
                {files.map((file, index) => (
                    <View key={index} className="bg-blue-50/50 p-3.5 rounded-xl flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1">
                            <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                                <Ionicons name={getFileIcon(file.type)} size={20} color="#3B82F6" />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-[15px] text-blue-950" numberOfLines={1}>
                                    {file.name}
                                </Text>
                                <View className="flex-row items-center mt-0.5">
                                    <Text className="text-sm text-blue-500">{file.size}</Text>
                                    <Text className="text-sm text-blue-400 mx-1.5">•</Text>
                                    <Text className="text-sm text-blue-500">{file.date}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity className="w-9 h-9 bg-blue-100 rounded-lg items-center justify-center ml-3 active:bg-blue-200">
                            <Ionicons name="download-outline" size={18} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
} 