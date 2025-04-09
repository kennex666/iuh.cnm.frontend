import {SplashScreen, Stack} from 'expo-router';
import {useEffect} from 'react';
import {useFonts} from 'expo-font';
import {AuthProvider} from '@/src/contexts/userContext';
import "../global.css";
import {setupAxios} from "@/src/api/axiosConfig";

export {
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({});

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    useEffect(() => {
        // Setup axios with authentication
        setupAxios();
    }, []);

    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(main)" />
            </Stack>
        </AuthProvider>
    );
}