import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

interface QrScannerProps {
    onScan: (data: string) => void;
    onError: (error: string) => void;
    onClose: () => void;
}

export function QrScanner({ onScan, onError, onClose }: QrScannerProps) {
    return (
        <View className='flex-1 items-center justify-center'>
            
        </View>
    )
}

export default QrScanner
