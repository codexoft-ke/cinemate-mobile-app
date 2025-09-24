import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { Text } from '@/components/ui/app-text';
import { CineMateColors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLoadFonts } from '@/hooks/use-fonts';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: '(app)',
};

function RootLayoutNav() {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading screen while checking authentication
    if (isLoading) {
        return (
            <View className="flex-1 bg-dark-bg items-center justify-center">
                <ActivityIndicator size="large" color={CineMateColors.primary} />
                <Text variant="h6" color="#FFFFFF" className="mt-4">
                    Loading...
                </Text>
            </View>
        );
    }

    return (
        <Stack>
            <Stack.Protected guard={!isAuthenticated}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding-screen" options={{ headerShown: false, gestureEnabled: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    );
}

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
        <AuthProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SafeAreaView className="flex-1 bg-dark-bg" edges={['bottom', 'top']}>
                    <RootLayoutNav />
                    <StatusBar style="auto" />
                </SafeAreaView>
            </ThemeProvider>
        </AuthProvider>
    );
}