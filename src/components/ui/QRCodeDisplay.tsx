import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Props {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 250 }: Props) {
  return (
    <View className="items-center">
      <QRCode
        value={value}
        size={size}
        color="black"
        backgroundColor="white"
      />
    </View>
  );
}