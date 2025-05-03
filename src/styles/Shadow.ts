import {StyleSheet} from 'react-native';

export const Shadows = StyleSheet.create({
    sm: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        elevation: 1,
    },
    md: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        elevation: 3,
    },
    lg: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)',
        elevation: 5,
    },
    xl: {
        boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.2)',
        elevation: 7,
    },
});
