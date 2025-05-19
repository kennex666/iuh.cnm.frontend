import React from 'react';
import {Image, ImageSourcePropType, View} from 'react-native';
import {ImageConstants} from "@/src/constants/ImageConstant";
import {Shadows} from '@/src/styles/Shadow';

interface AppLogoProps {
    size?: number;
    logoSource?: ImageSourcePropType;
    className?: string;
}

const AppLogo = (
    {
        size = 80,
        logoSource = ImageConstants.logo,
        className = ''
    }: AppLogoProps) => {
    return (
        <View className={`items-center mb-6 ${className}`}>
            <View
                className="bg-white rounded-2xl p-2"
                style={Shadows.sm}>
                <Image
                    source={logoSource}
                    style={{width: size, height: size}}
                    resizeMode="contain"
                    accessible={true}
                    accessibilityLabel="Application logo"
                />
            </View>
        </View>
    );
};

export default AppLogo;