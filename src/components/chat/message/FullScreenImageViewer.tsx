import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";

interface FullScreenImageViewerProps {
    imageUri: string;
    onClose: () => void;
}

const FullScreenImageViewer: React.FC<FullScreenImageViewerProps> = (
    {
        imageUri,
        onClose
    }) => {
    return (
        <View className="absolute inset-0 bg-black z-50 flex-1 justify-center items-center">
            <Image
                source={{uri: imageUri}}
                className="w-full h-full"
                resizeMode="contain"
            />
            <TouchableOpacity
                className="absolute top-10 right-5 bg-black/30 rounded-full p-2"
                onPress={onClose}
            >
                <Ionicons name="close" size={24} color="white"/>
            </TouchableOpacity>
        </View>
    );
};

export default FullScreenImageViewer;