import React from 'react';
import {Text, View} from 'react-native';

interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

const AuthHeader = ({title, subtitle}: AuthHeaderProps) => {
    return (
        <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                {title}
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-relaxed">
                {subtitle}
            </Text>
        </View>
    );
};

export default AuthHeader;