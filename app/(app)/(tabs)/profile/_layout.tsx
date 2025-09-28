
import { Stack } from 'expo-router';

export default function Search() {
    return (
        <Stack initialRouteName='index'>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="update-profile" options={{ headerShown: false}} />
        </Stack>
    );
}
