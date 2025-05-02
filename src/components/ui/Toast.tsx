import React, {useEffect} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
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
    const translateY = new Animated.Value(20);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 0,
                    damping: 15,
                    mass: 1,
                    stiffness: 200,
                    useNativeDriver: true,
                })
            ]).start();

            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.spring(translateY, {
                        toValue: 20,
                        damping: 15,
                        mass: 1,
                        stiffness: 200,
                        useNativeDriver: true,
                    })
                ]).start(() => onHide());
            }, duration);

            return () => clearTimeout(timer);
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
                return 'checkmark-circle';
            case 'error':
                return 'alert-circle';
            case 'warning':
                return 'warning';
            case 'info':
                return 'information-circle';
            default:
                return 'information-circle';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return '#10B981';
            case 'error':
                return '#EF4444';
            case 'warning':
                return '#F59E0B';
            case 'info':
                return '#3B82F6';
            default:
                return '#3B82F6';
        }
    };

    return (
        <Animated.View 
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }]
                }
            ]}
        >
            <View style={[styles.toastContent, getToastStyle()]}>
                {showIcon && (
                    <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
                        <Ionicons
                            name={getIconName()}
                            size={24}
                            color={getIconColor()}
                        />
                    </View>
                )}
                <Text style={[styles.message, { color: getIconColor() }]}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 60,
        left: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    toastContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        maxWidth: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },
    success: {
        borderColor: '#10B981',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    error: {
        borderColor: '#EF4444',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    warning: {
        borderColor: '#F59E0B',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    info: {
        borderColor: '#3B82F6',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    message: {
        fontSize: 15,
        fontWeight: '500',
        flexShrink: 1,
        lineHeight: 20,
    }
});

export default Toast;