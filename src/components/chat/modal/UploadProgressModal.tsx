import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface UploadProgressModalProps {
    visible: boolean;
    progress: number;
    statusMessage: string;
    onCancel: () => void;
}

const UploadProgressModal: React.FC<UploadProgressModalProps> = (
    {
        visible,
        progress,
        statusMessage,
        onCancel,
    }) => {
    if (!visible) return null;

    return (
        <View className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center">
            <View className="bg-white rounded-2xl p-5 w-[85%] max-w-md">
                <View className="items-center">
                    <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mb-4">
                        {progress < 100 ? (
                            <Ionicons name="cloud-upload-outline" size={32} color="#3B82F6"/>
                        ) : (
                            <Ionicons name="checkmark-circle" size={32} color="#10B981"/>
                        )}
                    </View>
                    <Text className="text-lg font-medium text-gray-900 mb-2">
                        {progress < 100 ? "Uploading File" : "Upload Complete"}
                    </Text>
                    <Text className="text-gray-600 text-center mb-4">
                        {statusMessage}
                    </Text>
                </View>

                {/* Progress Bar */}
                <View className="bg-gray-200 h-2 rounded-full mb-4 overflow-hidden">
                    <View
                        className="bg-blue-500 h-full rounded-full"
                        style={{width: `${progress}%`}}
                    />
                </View>

                {/* Cancel button - only show during active upload */}
                {progress < 100 && (
                    <TouchableOpacity
                        className="mt-2 py-3 px-4 rounded-lg bg-gray-100 items-center"
                        onPress={onCancel}
                    >
                        <Text className="text-gray-700 font-medium">Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default UploadProgressModal;