import React from 'react';
import {Image, ImageSourcePropType, View} from 'react-native';
import {ImageConstants} from "@/src/constants/ImageConstant";
import {Shadows} from '@/src/styles/Shadow';

interface AppLogoProps {
    size?: number;
    logoSource?: ImageSourcePropType;
}

const AppLogo = ({
                     size = 80,
                     logoSource = ImageConstants.logo,
                 }: AppLogoProps) => {
    return (
        <View className="items-center mb-6">
            <View 
                className="bg-white rounded-2xl p-2"
                style={Shadows.sm}>
                <Image
                    source={logoSource}
                    style={{width: size, height: size}}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
};

export default AppLogo;