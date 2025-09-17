import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { Movie } from '@/types';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, View, TextInput } from 'react-native';

export default function SearchScreen() {
    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Search' />
            <View className='flex-row items-center bg-[#192C40] mx-4 mt-3 rounded-full px-4 py-2'>
                <Feather name="search" size={24} color="white" style={{ fontWeight: 'bold' }} />
                <TextInput
                    className='text-white ml-3 flex-1 font-montserrat-medium py-2 focus-visible:outline-none'
                    placeholder="Search for movies, TV shows..."
                    placeholderTextColor="#666"
                />
                <Feather name="sliders" size={24} color="white" style={{ fontWeight: 'bold' }} />
            </View>
            <ScrollView className="relative w-full h-full"
            >
                <MovieCard data={{
                    id: 1311031,
                    title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
                    poster: "https://image.tmdb.org/t/p/w500/1RgPyOhN4DRs225BGTlHJqCudII.jpg",
                    isFavorite: false,
                    releaseDate: "2025-02-11",
                    subTitle: "12 Apr 2025",
                    duration: 67,
                    genre: "Animation",
                    rating: 8.5
                }} />
            </ScrollView>
        </View>
    );
}

const MovieCard = ({ data }: { data: Movie }) => {
    return (
        <View className="relative w-full h-full">
            <Image
                source={{ uri: data.backdrop || data.poster }}
                style={{ width: 200, height: 100 }}
                contentFit="cover"
                transition={300}
            />
        </View>
    )
}