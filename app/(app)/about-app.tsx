import { AppHeader } from '@/components/ui/app-header';
import { ScrollView, Text, View } from 'react-native';

export default function AboutApp() {
    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='About App' />
            <ScrollView className="flex-1 bg-dark-bg px-4">
                <View className="flex-1 pb-24">
                    <View className="mb-6">
                        <Text className="text-text-primary text-2xl font-poppins-bold mb-2">CineMate</Text>
                        <Text className="text-text-secondary text-base font-poppins-regular">
                            Your ultimate companion for discovering and exploring movies. Stay updated with the latest releases, reviews, and recommendations tailored just for you.
                        </Text>
                    </View>
                    
                    <View className="mb-6">
                        <Text className="text-text-primary text-xl font-poppins-semibold mb-3">Features</Text>
                        <View className="space-y-2">
                            <Text className="text-text-secondary text-base font-poppins-regular">• Discover trending movies and TV shows</Text>
                            <Text className="text-text-secondary text-base font-poppins-regular">• Personalized recommendations</Text>
                            <Text className="text-text-secondary text-base font-poppins-regular">• Detailed movie information and reviews</Text>
                            <Text className="text-text-secondary text-base font-poppins-regular">• Watchlist and favorites management</Text>
                            <Text className="text-text-secondary text-base font-poppins-regular">• User authentication and profiles</Text>
                        </View>
                    </View>
                    
                    <View className="mb-6">
                        <Text className="text-text-primary text-xl font-poppins-semibold mb-3">Version</Text>
                        <Text className="text-text-secondary text-base font-poppins-regular">1.0.0</Text>
                    </View>
                    
                    <View className="mb-6">
                        <Text className="text-text-primary text-xl font-poppins-semibold mb-3">Contact Us</Text>
                        <Text className="text-text-secondary text-base font-poppins-regular">For support or feedback, reach out to us at support@cinemate.com</Text>
                    </View>
                    
                    <View className="mb-6">
                        <Text className="text-text-primary text-xl font-poppins-semibold mb-3">About the Developer</Text>
                        <Text className="text-text-secondary text-base font-poppins-regular">
                            CineMate is developed by Codexoft, a team passionate about bringing the best movie experiences to your fingertips.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}