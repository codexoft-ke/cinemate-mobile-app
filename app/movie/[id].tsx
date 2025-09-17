import { View } from 'react-native';
import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { useGlobalSearchParams } from 'expo-router';

export default function MovieInfo() {
const {title,id} = useGlobalSearchParams();
    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Movie Info' />
            <View className='flex-1 justify-center items-center'>
                <Text className='text-white'>Movie Id: {id}</Text>
                <Text className='text-white'>Movie Title: {title}</Text>
            </View>
        </View>
    );
}