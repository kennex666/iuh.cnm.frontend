import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Shadows} from '@/src/styles/Shadow';

interface FormInputProps {
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    editable?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    showTogglePassword?: boolean;
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
                   }: FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View
            className="bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden"
            style={Shadows.sm}>
            <View className="flex-row items-center px-3 sm:px-4">
                <Ionicons name={icon} size={20} color="#9CA3AF"/>
                <TextInput
                    className="flex-1 h-[48px] sm:h-[56px] ml-2 sm:ml-3 text-gray-800 text-sm sm:text-base outline-none focus:outline-none"
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !showPassword}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={keyboardType}
                    editable={editable}
                    autoCapitalize={autoCapitalize}
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
            </View>
        </View>
    );
};

export default FormInput;