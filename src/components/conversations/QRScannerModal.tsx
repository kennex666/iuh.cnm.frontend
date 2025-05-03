import React from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
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
            transparent={true}
            visible={showQRScanner}
            onRequestClose={() => setShowQRScanner(false)}
        >
            <View className="flex-1">
                <View>
                    <TouchableOpacity 
                        className="absolute top-12 left-8 z-50 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
                        onPress={() => setShowQRScanner(false)}
                    >
                        <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <QRScanner setShowQRScanner={setShowQRScanner}/>
            </View>
        </Modal>
    );
}; 