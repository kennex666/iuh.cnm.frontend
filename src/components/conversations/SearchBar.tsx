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
        <View className="px-4 py-4 border-b border-gray-100 bg-white">
            <View className="flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 h-12">
                    <Ionicons name="search" size={16} color="#65676B" />
                    <TextInput
                        className="flex-1 ml-2 text-[15px] text-gray-700"
                        placeholder="Tìm kiếm trên Messify"
                        placeholderTextColor="#65676B"
                    />
                </View>
                {Platform.OS !== "web" && (
                    <TouchableOpacity 
                        className="ml-2 w-9 h-9 items-center justify-center"
                        onPress={() => setShowQRScanner(!showQRScanner)}
                    >
                        <MaterialCommunityIcons name="qrcode-scan" size={24} color="#0084FF" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}; 