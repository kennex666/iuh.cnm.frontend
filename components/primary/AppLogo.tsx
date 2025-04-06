import React from 'react';
import {Image, ImageSourcePropType, View} from 'react-native';
import {ImageConstant} from "@/constants/ImageConstant";

interface AppLogoProps {
    size?: number;
    logoSource?: ImageSourcePropType;
}

const AppLogo = ({
                     size = 80,
                     logoSource = ImageConstant.logo,
                 }: AppLogoProps) => {
    return (
        <View className="items-center mb-6">
            <View className="bg-white rounded-2xl shadow-sm p-2">
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