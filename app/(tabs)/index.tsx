import { Text } from '@/components/ui/app-text';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Text>This is the homescreen</Text>
    </ScrollView>
  );
}