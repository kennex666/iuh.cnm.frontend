import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface ButtonProps {
    onPress: () => void;
    title: string;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'outline' | 'secondary' | 'danger' | 'success';
    size?: 'small' | 'medium' | 'large';
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    className?: string;
}

const Button = ({
                    onPress,
                    title,
                    loading = false,
                    disabled = false,
                    variant = 'primary',
                    size = 'medium',
                    icon,
                    iconPosition = 'left',
                    className = '',
                }: ButtonProps) => {
    const getStyles = () => {
        switch (variant) {
            case 'outline':
                return {
                    container: 'border-2 border-blue-500',
                    text: 'text-blue-500',
                    iconColor: '#3B82F6'
                };
            case 'secondary':
                return {
                    container: 'bg-gray-500',
                    text: 'text-white',
                    iconColor: '#FFFFFF'
                };
            case 'danger':
                return {
                    container: 'bg-red-500',
                    text: 'text-white',
                    iconColor: '#FFFFFF'
                };
            case 'success':
                return {
                    container: 'bg-green-500',
                    text: 'text-white',
                    iconColor: '#FFFFFF'
                };
            case 'primary':
            default:
                return {
                    container: 'bg-blue-500',
                    text: 'text-white',
                    iconColor: '#FFFFFF'
                };
        }
    };

    const getSize = () => {
        switch (size) {
            case 'small':
                return 'h-[40px] sm:h-[44px]';
            case 'large':
                return 'h-[56px] sm:h-[64px]';
            case 'medium':
            default:
                return 'h-[48px] sm:h-[56px]';
        }
    };

    const styles = getStyles();
    const sizeClass = getSize();

    return (
        <TouchableOpacity
            className={`
                ${sizeClass} rounded-xl sm:rounded-2xl items-center justify-center flex-row space-x-2
                ${styles.container}
                ${disabled ? 'opacity-50' : ''}
                ${className}
            `}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={loading || disabled}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? "#3B82F6" : "#FFFFFF"}/>
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <Ionicons
                            name={icon}
                            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                            color={styles.iconColor}
                            style={{marginRight: 8}}
                        />
                    )}
                    <Text
                        className={`${styles.text} font-semibold ${
                            size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
                        }`}
                    >
                        {title}
                    </Text>
                    {icon && iconPosition === 'right' && (
                        <Ionicons
                            name={icon}
                            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                            color={styles.iconColor}
                            style={{marginLeft: 8}}
                        />
                    )}
                </>
            )}
        </TouchableOpacity>
    );
};

export default Button;