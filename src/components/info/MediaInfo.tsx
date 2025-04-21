import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface MediaInfoProps {
    images: string[];
    onViewAll?: () => void;
}

export default function MediaInfo({ images, onViewAll }: MediaInfoProps) {
    return (
        <View className="px-4 pt-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-medium text-blue-950">Ảnh/Video đã chia sẻ</Text>
                <TouchableOpacity 
                    className="py-1 px-3 rounded-lg bg-blue-50 active:bg-blue-100"
                    onPress={onViewAll}
                >
                    <Text className="text-blue-500">Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap -mx-1">
                {images.slice(0, 6).map((uri, index) => (
                    <TouchableOpacity
                        key={index}
                        className="w-[32%] aspect-square p-1"
                    >
                        <Image
                            source={{ uri }}
                            className="w-full h-full rounded-xl border border-blue-100"
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
} 