import React from 'react';
import { Text, TouchableOpacity, View, Linking } from 'react-native';
import { Message } from '@/src/models/Message';

interface IncomingCallModalProps {
    isVisible: boolean;
    linkCall: string;
    onAccept: () => void;
    onDecline: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
    isVisible,
    linkCall,
    onAccept,
    onDecline
}) => {
    if (!isVisible) return null;

    return (
        <View className="absolute inset-0 bg-black/70 z-50">
            <View className="flex-1 items-center justify-center">
                <Text className="text-white text-xl mb-2">
                    📞 Bạn có cuộc gọi đến
                </Text>
                <Text className="text-white text-sm mb-6">
                    Chọn để tham gia hoặc từ chối
                </Text>

                <View className="flex-row space-x-6">
                    <TouchableOpacity
                        className="bg-green-500 rounded-full w-16 h-16 items-center justify-center"
                        onPress={() => {
                            Linking.openURL(linkCall);
                            onAccept();
                        }}
                    >
                        <Text className="text-white text-2xl">✓</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-red-500 rounded-full w-16 h-16 items-center justify-center"
                        onPress={onDecline}
                    >
                        <Text className="text-white text-2xl">✕</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}; 