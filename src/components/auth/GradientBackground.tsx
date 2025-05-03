import React from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';

interface GradientBackgroundProps {
    children: React.ReactNode;
    keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
    className?: string;
}

const GradientBackground = ({
                                children,
                                keyboardShouldPersistTaps = 'handled',
                                className = ''
                            }: GradientBackgroundProps) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className={`flex-1 bg-gradient-to-b from-blue-50 to-white ${className}`}
        >
            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps={keyboardShouldPersistTaps}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default GradientBackground;
