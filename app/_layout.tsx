import {SplashScreen, Stack} from 'expo-router';
import {useEffect} from 'react';
import {useFonts} from 'expo-font';
import {AuthProvider} from '@/src/contexts/UserContext';
import {setupAxios} from "@/src/api/AxiosConfig";
import "../global.css";

export {ErrorBoundary} from 'expo-router';

export const unstable_settings = {initialRouteName: '(auth)'};

SplashScreen.preventAutoHideAsync().catch(console.warn);

export default function RootLayout() {
    const [loaded, error] = useFonts({});

    useEffect(() => {
        setupAxios().catch(console.warn);

        if (error) throw error;

        if (loaded) {
            SplashScreen.hideAsync().catch(console.warn);
        }
    }, [loaded, error]);

    if (!loaded) return null;

    return (
        <AuthProvider>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(auth)"/>
                <Stack.Screen name="(main)"/>
            </Stack>
        </AuthProvider>
    );
}