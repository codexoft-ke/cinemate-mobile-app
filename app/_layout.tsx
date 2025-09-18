import 'react-native-reanimated';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLoadFonts } from '@/hooks/use-fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="onboarding-screen" options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Protected guard={true}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>
          </Stack>
        </GestureHandlerRootView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </ThemeProvider>
  );
}
