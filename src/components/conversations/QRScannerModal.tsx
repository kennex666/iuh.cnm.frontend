import React from 'react';
import { View, TouchableOpacity, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRScanner from '../ui/QRScanner';

interface QRScannerModalProps {
    showQRScanner: boolean;
    setShowQRScanner: (show: boolean) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
    showQRScanner,
    setShowQRScanner
}) => {
    if (!showQRScanner) return null;

    return (
        <Modal 
            animationType="slide"
            transparent={false}
            visible={showQRScanner}
            onRequestClose={() => setShowQRScanner(false)}
        >
            <View className="flex-1 bg-black">
                <View className="flex-row items-center justify-between px-4 pt-14 pb-4">
                    <Text className="text-white text-lg font-semibold">
                        Quét mã QR
                    </Text>
                    <TouchableOpacity 
                        className="w-8 h-8 items-center justify-center"
                        onPress={() => setShowQRScanner(false)}
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 items-center justify-center">
                    <View className="w-72 h-72 overflow-hidden">
                        <QRScanner setShowQRScanner={setShowQRScanner}/>
                        <View className="absolute inset-0 border-2 border-[#0084FF]" />
                    </View>
                    <Text className="text-white/80 text-center mt-6 text-sm px-6">
                        Di chuyển camera đến mã QR để quét
                    </Text>
                </View>
            </View>
        </Modal>
    );
}; 