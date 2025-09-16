
import { Stack } from 'expo-router';

export default function Search() {
  return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
  );
}
