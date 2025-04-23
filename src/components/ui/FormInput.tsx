import React, {useEffect, useRef, useState} from 'react';
import {
    NativeSyntheticEvent,
    Platform,
    Text,
    TextInput,
    TextInputKeyPressEventData,
    TextInputProps,
    TouchableOpacity,
    View
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Shadows} from '@/src/styles/Shadow';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    editable?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    showTogglePassword?: boolean;
    label?: string;
    error?: string;
    prefixContent?: React.ReactNode;
    suffixContent?: React.ReactNode;
    autoFocus?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    iconColor?: string;
    onEnterPress?: () => void;
}

const FormInput = ({
                       icon,
                       placeholder,
                       value,
                       onChangeText,
                       secureTextEntry = false,
                       keyboardType = 'default',
                       editable = true,
                       autoCapitalize = 'none',
                       showTogglePassword = false,
                       // Các props mới
                       label,
                       error,
                       prefixContent,
                       suffixContent,
                       autoFocus = false,
                       containerClassName = '',
                       labelClassName = '',
                       inputClassName = '',
                       iconColor = "#9CA3AF",
                       onEnterPress,
                       ...otherProps
                   }: FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [autoFocus]);

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter' && onEnterPress) {
            onEnterPress();
        }
    };

    return (
        <View className={containerClassName}>
            {label && (
                <Text className={`text-gray-700 font-medium mb-1 text-sm ${labelClassName}`}>
                    {label}
                </Text>
            )}

            <View
                className={`
                    bg-white border rounded-xl sm:rounded-2xl overflow-hidden
                    ${error ? 'border-red-500' : 'border-gray-100'}
                `}
                style={Shadows.sm}>
                <View className="flex-row items-center px-3 sm:px-4">
                    {prefixContent}

                    <Ionicons name={icon} size={20} color={iconColor}/>

                    <TextInput
                        ref={inputRef}
                        className={`
                            flex-1 h-[48px] sm:h-[56px] ml-2 sm:ml-3 
                            text-gray-800 text-sm sm:text-base
                            outline-none focus:outline-none
                            ${inputClassName}
                        `}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry && !showPassword}
                        placeholderTextColor="#9CA3AF"
                        keyboardType={keyboardType}
                        editable={editable}
                        autoCapitalize={autoCapitalize}
                        onKeyPress={handleKeyPress}
                        {...otherProps}
                    />

                    {showTogglePassword && (
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            activeOpacity={0.7}
                            className="p-2"
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>
                    )}

                    {suffixContent}
                </View>
            </View>

            {error && (
                <Text className="text-red-500 mt-1 text-xs">
                    {error}
                </Text>
            )}
        </View>
    );
};

export default FormInput;