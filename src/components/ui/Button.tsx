import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface ButtonProps {
    onPress: () => void;
    title: string;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'outline';
    icon?: keyof typeof Ionicons.glyphMap;
    className?: string;
}

const Button = ({
                    onPress,
                    title,
                    loading = false,
                    disabled = false,
                    variant = 'primary',
                    icon,
                    className = '',
                }: ButtonProps) => {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            className={`
        h-[48px] sm:h-[56px] rounded-xl sm:rounded-2xl items-center justify-center flex-row space-x-2
        ${isPrimary
                ? loading
                    ? 'bg-blue-400'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                : 'border-2 border-blue-500'
            }
        ${className}
      `}
            onPress={onPress}
            activeOpacity={isPrimary ? 0.8 : 0.7}
            disabled={loading || disabled}
        >
            {loading ? (
                <ActivityIndicator color="white"/>
            ) : (
                <>
                    {icon && <Ionicons name={icon} size={20} color={isPrimary ? "#FFFFFF" : "#3B82F6"}/>}
                    <Text
                        className={`${isPrimary ? 'text-white' : 'text-blue-500'} font-semibold text-base sm:text-lg`}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

export default Button;