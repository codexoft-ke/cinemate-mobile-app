
import { Stack } from 'expo-router';

export default function Search() {
    return (
        <Stack initialRouteName='index'>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="about-app" options={{ presentation: 'modal', title: 'About App' }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
        </Stack>
    );
}
