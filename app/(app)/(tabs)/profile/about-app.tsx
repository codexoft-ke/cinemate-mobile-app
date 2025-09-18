import { ScrollView, Text, View } from 'react-native';

export default function AboutApp() {
  return (
    <ScrollView className="flex-1 bg-dark-bg">
      <View className="flex-1 justify-center items-center pb-24">
        <Text className="text-text-primary text-lg font-poppins-medium">This Is the Favourites screen</Text>
      </View>
    </ScrollView>
  );
}