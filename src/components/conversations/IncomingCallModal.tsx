import React from 'react';
import { Text, TouchableOpacity, View, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        <View className="absolute inset-0 bg-black/90 z-50">
            <View className="flex-1 items-center justify-center px-6">
                <View className="w-20 h-20 bg-[#0084FF] rounded-full items-center justify-center mb-6">
                    <Ionicons name="call" size={32} color="white" />
                </View>

                <Text className="text-white text-xl font-semibold mb-2">
                    Cuộc gọi đến
                </Text>
                <Text className="text-white/70 text-base text-center mb-10">
                    Bạn có muốn tham gia cuộc gọi này?
                </Text>

                <View className="flex-row items-center space-x-8">
                    <TouchableOpacity
                        className="w-16 h-16 bg-[#31A24C] rounded-full items-center justify-center"
                        onPress={() => {
                            Linking.openURL(linkCall);
                            onAccept();
                        }}
                    >
                        <Ionicons name="call" size={28} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-16 h-16 bg-[#F02849] rounded-full items-center justify-center"
                        onPress={onDecline}
                    >
                        <Ionicons 
                            name="call" 
                            size={28} 
                            color="white"
                            style={{ transform: [{ rotate: '135deg' }] }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}; 