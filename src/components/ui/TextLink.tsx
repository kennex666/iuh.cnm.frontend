import React from 'react';
import {Text, View} from 'react-native';
import {Href, Link} from "expo-router";

interface TextLinkProps {
    href: Href;
    text: string;
    linkText: string;
    className?: string;
}

const TextLink = ({href, text, linkText, className = ''}: TextLinkProps) => {
    return (
        <View className={`flex-row justify-center items-center ${className}`}>
            <Text className="text-gray-600 text-sm sm:text-base">
                {text}
            </Text>
            <Link
                href={href}
                className="text-blue-500 font-medium text-sm sm:text-base ml-1 hover:underline"
            >
                {linkText}
            </Link>
        </View>
    );
};

export default TextLink;