
import { Stack } from 'expo-router';

export default function MainApp() {
    return (
        <Stack initialRouteName='(tabs)'>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="movie/[id]" options={{ headerShown: false, presentation: 'modal' }} />
        </Stack>
    );
}
