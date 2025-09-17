import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { View } from 'react-native';

export default function Recommendation() {
    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Recommendation' />
            <View className='flex-1 justify-center items-center'>
                <Text className='text-white'>Recommendation</Text>
            </View>
        </View>
    );
}