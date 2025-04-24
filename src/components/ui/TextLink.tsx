import React from 'react';
import {Text, View} from 'react-native';
import {Href, Link, LinkProps} from "expo-router";

interface TextLinkProps {
    href: Href;
    text: string;
    linkText: string;
    className?: string;
    linkColor?: string;
    textClassName?: string;
    linkClassName?: string;
    align?: 'left' | 'center' | 'right';
    linkProps?: Omit<LinkProps, 'href'>;
}

const TextLink = ({
                      href,
                      text,
                      linkText,
                      className = '',
                      linkColor = 'text-blue-500',
                      textClassName = '',
                      linkClassName = '',
                      align = 'center',
                      linkProps
                  }: TextLinkProps) => {
    const getAlignClass = () => {
        switch (align) {
            case 'left':
                return 'justify-start';
            case 'right':
                return 'justify-end';
            case 'center':
            default:
                return 'justify-center';
        }
    };

    return (
        <View className={`flex-row items-center ${getAlignClass()} ${className}`}>
            <Text className={`text-gray-600 text-sm sm:text-base ${textClassName}`}>
                {text}
            </Text>
            <Link
                href={href}
                className={`${linkColor} font-medium text-sm sm:text-base ml-1 hover:underline ${linkClassName}`}
                {...linkProps}
            >
                {linkText}
            </Link>
        </View>
    );
};

export default TextLink;