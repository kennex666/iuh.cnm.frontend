import React from 'react';
import {Animated, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Shadows} from '@/src/styles/Shadow';

interface FileSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectImage: () => void;
    onSelectFile: () => void;
    scaleAnimation: Animated.Value;
}

const FileSelectionModal: React.FC<FileSelectionModalProps> = (
    {
        visible,
        onClose,
        onSelectImage,
        onSelectFile,
        scaleAnimation,
    }) => {
    if (!visible) return null;

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <View className="absolute inset-0 z-40">
                <View className="absolute bottom-20 left-2 bg-white z-50">
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        translateY: scaleAnimation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [30, 0],
                                        })
                                    },
                                ],
                                opacity: scaleAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                }),
                            }}
                        >
                            <View
                                className="bg-white rounded-lg p-4 w-[300px]"
                                style={Shadows.md}
                            >
                                <Text className="text-gray-800 mb-2">Chọn loại tệp</Text>

                                <TouchableOpacity
                                    className="flex-row items-center mb-2"
                                    onPress={onSelectImage}
                                >
                                    <Ionicons name="image-outline" size={24} color="#666"/>
                                    <Text className="ml-2 text-gray-800">Hình ảnh/Video</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-row items-center mb-2"
                                    onPress={onSelectFile}
                                >
                                    <Ionicons
                                        name="file-tray-full-outline"
                                        size={24}
                                        color="#666"
                                    />
                                    <Text className="ml-2 text-gray-800">File</Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default FileSelectionModal;