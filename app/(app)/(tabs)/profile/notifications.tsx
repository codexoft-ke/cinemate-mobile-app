import { View } from 'react-native';
import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';

export default function Notifications() {
    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Notifications' showRightIcon={false} />
            <View className='flex-1 justify-center items-center'>
                <Text className='text-white'>Notifications</Text>
            </View>
        </View>
    );
}