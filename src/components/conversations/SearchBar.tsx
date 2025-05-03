import React from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface SearchBarProps {
    showQRScanner: boolean;
    setShowQRScanner: (show: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    showQRScanner,
    setShowQRScanner
}) => {
    return (
        <View className="py-4 justify-between flex-row items-center">
            <View className="flex-row items-center bg-gray-200 rounded-full px-4 py-2 h-12 flex-1 mr-4">
                <Ionicons name="search-outline" size={20} color="#666" />
                <TextInput
                    className="flex-1 ml-2 text-lg"
                    placeholder="Tìm kiếm cuộc trò chuyện..."
                    placeholderTextColor="#666"
                />
            </View>
            {Platform.OS !== "web" && (
                <TouchableOpacity 
                    className="items-center justify-center w-11 h-11 bg-blue-400 rounded-full"
                    onPress={() => setShowQRScanner(!showQRScanner)}
                >
                    <MaterialCommunityIcons name="qrcode-scan" size={18} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
}; 