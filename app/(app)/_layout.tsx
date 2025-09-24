
import { Stack } from 'expo-router';

export default function MainApp() {
    // Authentication is handled at the root level
    // This layout only renders when user is authenticated
    
    return (
        <Stack initialRouteName='(tabs)'>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="movie/[id]" options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name="about-app" options={{ presentation: 'modal', title: 'About App' }} />
        </Stack>
    );
}
