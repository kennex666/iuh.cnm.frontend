import {SplashScreen, Stack} from 'expo-router';
import {useEffect} from 'react';
import {useFonts} from 'expo-font';
import {AuthProvider} from '@/src/contexts/userContext';
import "../global.css";

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

    return (
        <AuthProvider>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="(main)" options={{headerShown: false}}/>
            </Stack>
        </AuthProvider>
    );
}