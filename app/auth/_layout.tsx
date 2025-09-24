
import { Stack } from 'expo-router';

export default function AuthScreen() {
    // Authentication guard is handled at the root level
    // This layout only renders when user is not authenticated
    
    return (
        <Stack initialRouteName='signin'>
            <Stack.Screen name="signin" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>
    );
}
