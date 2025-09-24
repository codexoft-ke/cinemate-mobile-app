import { AppHeader } from '@/components/ui/app-header';
import { ScrollView, Text, View } from 'react-native';

export default function AboutApp() {
    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='About App' />
            <ScrollView className="flex-1 bg-dark-bg">
                <View className="flex-1 justify-center items-center pb-24">
                    <Text className="text-text-primary text-lg font-poppins-medium">About App Screen</Text>
                </View>
            </ScrollView>
        </View>
    );
}