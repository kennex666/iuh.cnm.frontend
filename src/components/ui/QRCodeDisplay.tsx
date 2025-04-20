import React from 'react';
import {View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface Props {
    value: string;
    size?: number;
    color?: string;
    backgroundColor?: string;
    logo?: { uri: string } | number;
    logoSize?: number;
    containerClassName?: string;
}

export default function QRCodeDisplay({
                                          value,
                                          size = 250,
                                          color = 'black',
                                          backgroundColor = 'white',
                                          logo,
                                          logoSize,
                                          containerClassName = ''
                                      }: Props) {
    return (
        <View className={`items-center justify-center p-2 ${containerClassName}`}>
            <QRCode
                value={value}
                size={size}
                color={color}
                backgroundColor={backgroundColor}
                logo={logo}
                logoSize={logoSize}
                quietZone={10}
            />
        </View>
    );
}