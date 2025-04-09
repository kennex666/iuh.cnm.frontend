import React, { Component } from 'react'
import { Text, View } from 'react-native'

// interface QRCodeProps 
interface QRCodeProps {
    onClose?: () => void;
}

// Định nghĩa React Functional Component
const QRCode: React.FC<QRCodeProps> = ({ onClose }) => {
    return (
        <View className="flex-1 items-center justify-center">
            <Text>QR Code</Text>
        </View>
    )
}

export default QRCode
