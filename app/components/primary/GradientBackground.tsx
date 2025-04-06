import React from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';

interface GradientBackgroundProps {
    children: React.ReactNode;
    keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

const GradientBackground = ({
                                children,
                                keyboardShouldPersistTaps = 'handled'
                            }: GradientBackgroundProps) => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gradient-to-b from-blue-50 to-white"
        >
            <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default GradientBackground;
