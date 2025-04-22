import React, {useEffect} from 'react';
import {Animated, StyleSheet, Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface ToastProps {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onHide: () => void;
    duration?: number;
    showIcon?: boolean;
}

const Toast = ({
                   visible,
                   message,
                   type,
                   onHide,
                   duration = 2000,
                   showIcon = true
               }: ToastProps) => {
    const opacity = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(duration),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => onHide());
        }
    }, [visible, duration]);

    if (!visible) return null;

    const getToastStyle = () => {
        switch (type) {
            case 'success':
                return styles.success;
            case 'error':
                return styles.error;
            case 'warning':
                return styles.warning;
            case 'info':
                return styles.info;
            default:
                return styles.info;
        }
    };

    const getIconName = (): keyof typeof Ionicons.glyphMap => {
        switch (type) {
            case 'success':
                return 'checkmark-circle-outline';
            case 'error':
                return 'alert-circle-outline';
            case 'warning':
                return 'warning-outline';
            case 'info':
                return 'information-circle-outline';
            default:
                return 'information-circle-outline';
        }
    };

    return (
        <Animated.View style={[styles.container, {opacity}, getToastStyle(), {zIndex: 9999}]}>
            {showIcon && (
                <Ionicons
                    name={getIconName()}
                    size={20}
                    color="white"
                    style={styles.icon}
                />
            )}
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    success: {
        backgroundColor: '#4CAF50',
    },
    error: {
        backgroundColor: '#F44336',
    },
    warning: {
        backgroundColor: '#FF9800',
    },
    info: {
        backgroundColor: '#2196F3',
    },
    icon: {
        marginRight: 8,
    },
    message: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        flexShrink: 1,
    }
});

export default Toast;