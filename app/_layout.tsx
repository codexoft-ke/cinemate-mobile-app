import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLoadFonts } from '@/hooks/use-fonts';
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: '(app)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const fontsLoaded = useLoadFonts();

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <SafeAreaView className="flex-1 bg-dark-bg" edges={['bottom', 'top']}>
                <Stack>
                    <Stack.Protected guard={false}>
                        <Stack.Screen name="index" options={{ headerShown: false }} />
                        <Stack.Screen name="onboarding-screen" options={{ headerShown: false, gestureEnabled: false }} />
                        <Stack.Screen name="auth" options={{ headerShown: false }} />
                    </Stack.Protected>
                    <Stack.Protected guard={true}>
                        <Stack.Screen name="(app)" options={{ headerShown: false }} />
                    </Stack.Protected>
                </Stack>
                <StatusBar style="auto" />
            </SafeAreaView>
        </ThemeProvider>
    );
}
