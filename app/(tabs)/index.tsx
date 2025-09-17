import MovieCard from '@/components/movie-card';
import Slider from '@/components/slider';
import { Text } from '@/components/ui/app-text';
import SectionHeader from '@/components/ui/section-header';
import { CineMateColors } from '@/constants/theme';
import { Movie } from '@/types';
import { getYear } from '@/utils';
import { Feather, Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { memo } from 'react';
import { Dimensions, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');


interface Category {
    id: number | string;
    name: string;
}

interface MovieSliderCardProps {
    movie: Movie;
    onPress?: () => void;
    onFavoritePress?: () => void;
    width?: number;
    height?: number;
}

export default function HomeScreen() {

    const router = useRouter();

    const trendingMovies: Movie[] = [
        {
            id: 1311031,
            title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
            poster: "https://image.tmdb.org/t/p/w500/1RgPyOhN4DRs225BGTlHJqCudII.jpg",
            isFavorite: false,
            releaseDate: "2025-02-11",
            genre: "Animation",
            rating: 8.5
        },
        {
            id: 755898,
            title: "War of the Worlds",
            poster: "https://image.tmdb.org/t/p/w500/iZLqwEwUViJdSkGVjePGhxYzbDb.jpg",
            isFavorite: true,
            releaseDate: "2024-01-12",
            genre: "Sci-Fi",
            rating: 6.2
        },
        {
            id: 1078605,
            title: "Weapons",
            poster: "https://image.tmdb.org/t/p/w500/Q2OajDi2kcO6yErb1IAyVDTKMs.jpg",
            isFavorite: false,
            releaseDate: "2024-06-14",
            genre: "Action",
            rating: 7.1
        },
        {
            id: 1038392,
            title: "The Conjuring: Last Rites",
            poster: "https://image.tmdb.org/t/p/w500/fq8gLtrz1ByW3KQ2IM3RMZEIjsQ.jpg",
            isFavorite: false,
            releaseDate: "2025-09-05",
            genre: "Horror",
            rating: 7.8
        },
        {
            id: 506763,
            title: "Detective Dee: The Four Heavenly Kings",
            poster: "https://image.tmdb.org/t/p/w500/rzGHVq2BCMwjp93QaKYoLPSaSrp.jpg",
            isFavorite: false,
            releaseDate: "2018-07-27",
            genre: "Mystery",
            rating: 6.8
        },
        {
            id: 1369679,
            title: "Get Fast",
            poster: "https://image.tmdb.org/t/p/w500/JMlVj6X2F1PuDz9OyHShThzpa2.jpg",
            isFavorite: false,
            releaseDate: "2024-11-08",
            genre: "Action",
            rating: 6.5
        },
        {
            id: 1007734,
            title: "Nobody 2",
            poster: "https://image.tmdb.org/t/p/w500/mEW9XMgYDO6U0MJcIRqRuSwjzN5.jpg",
            isFavorite: false,
            releaseDate: "2025-08-15",
            genre: "Action",
            rating: 8.2
        },
        {
            id: 1035259,
            title: "The Naked Gun",
            poster: "https://image.tmdb.org/t/p/w500/kzeBfhXMRWiykBsqoL3UbfaM0S.jpg",
            isFavorite: false,
            releaseDate: "2025-08-01",
            genre: "Comedy",
            rating: 7.4
        },
        {
            id: 1051486,
            title: "Stockholm Bloodbath",
            poster: "https://image.tmdb.org/t/p/w500/6nCy4OrV7gxhDc3lBSUxkNALPej.jpg",
            isFavorite: false,
            releaseDate: "2024-11-08",
            genre: "Drama",
            rating: 6.9
        },
        {
            id: 1061474,
            title: "Superman",
            poster: "https://image.tmdb.org/t/p/w500/eU7IfdWq8KQy0oNd4kKXS0QUR08.jpg",
            isFavorite: false,
            releaseDate: "2025-07-11",
            genre: "Superhero",
            rating: 8.7
        }
    ];

    const recommendation: Movie[] = [
        {
            id: 278,
            title: "The Shawshank Redemption",
            poster: "https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
            isFavorite: false,
            releaseDate: "1994-09-23",
            genre: "Drama",
            rating: 8.712
        },
        {
            id: 238,
            title: "The Godfather",
            poster: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            isFavorite: false,
            releaseDate: "1972-03-24",
            genre: "Drama",
            rating: 8.685
        },
        {
            id: 240,
            title: "The Godfather Part II",
            poster: "https://image.tmdb.org/t/p/original/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
            isFavorite: false,
            releaseDate: "1974-12-20",
            genre: "Drama",
            rating: 8.57
        },
        {
            id: 424,
            title: "Schindler's List",
            poster: "https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
            isFavorite: false,
            releaseDate: "1993-12-15",
            genre: "Drama",
            rating: 8.566
        },
        {
            id: 389,
            title: "12 Angry Men",
            poster: "https://image.tmdb.org/t/p/original/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
            isFavorite: false,
            releaseDate: "1957-04-10",
            genre: "Drama",
            rating: 8.549
        },
        {
            id: 129,
            title: "Spirited Away",
            poster: "https://image.tmdb.org/t/p/original/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
            isFavorite: false,
            releaseDate: "2002-09-20",
            genre: "Animation",
            rating: 8.5
        },
        {
            id: 155,
            title: "The Dark Knight",
            poster: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            isFavorite: false,
            releaseDate: "2008-07-18",
            genre: "Drama",
            rating: 8.523
        },
        {
            id: 19404,
            title: "Dilwale Dulhania Le Jayenge",
            poster: "https://image.tmdb.org/t/p/original/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
            isFavorite: false,
            releaseDate: "1995-10-20",
            genre: "Comedy",
            rating: 8.5
        },
        {
            id: 497,
            title: "The Green Mile",
            poster: "https://image.tmdb.org/t/p/original/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
            isFavorite: false,
            releaseDate: "1999-12-10",
            genre: "Fantasy",
            rating: 8.504
        },
        {
            id: 496243,
            title: "Parasite",
            poster: "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            isFavorite: false,
            releaseDate: "2019-10-11",
            genre: "Comedy",
            rating: 8.498
        }
    ];

    const upcomingMovies: Movie[] = [
        {
            id: 1311031,
            title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
            poster: "https://image.tmdb.org/t/p/w500/1RgPyOhN4DRs225BGTlHJqCudII.jpg",
            isFavorite: false,
            releaseDate: "2025-02-11",
            subTitle: "12 Apr 2025",
            duration: 67,
            genre: "Animation",
            rating: 8.5
        },
        {
            id: 755898,
            title: "War of the Worlds",
            poster: "https://image.tmdb.org/t/p/w500/iZLqwEwUViJdSkGVjePGhxYzbDb.jpg",
            isFavorite: true,
            releaseDate: "2024-01-12",
            subTitle: "12 Apr 2025",
            genre: "Sci-Fi",
            rating: 6.2
        },
        {
            id: 1078605,
            title: "Weapons",
            poster: "https://image.tmdb.org/t/p/w500/Q2OajDi2kcO6yErb1IAyVDTKMs.jpg",
            isFavorite: false,
            releaseDate: "2024-06-14",
            subTitle: "12 Apr 2025",
            genre: "Action",
            rating: 7.1
        }
    ];

    const movieCategories = [
        { id: 0, name: "All" },
        { id: 1, name: "Action" },
        { id: 2, name: "Comedy" },
        { id: 3, name: "Drama" },
        { id: 4, name: "Horror" },
        { id: 5, name: "Sci-Fi" },
        { id: 6, name: "Romance" },
        { id: 7, name: "Thriller" },
        { id: 8, name: "Animation" },
        { id: 9, name: "Documentary" },
        { id: 10, name: "Fantasy" }
    ];

    const onSearch = (text: string) => {
        console.log("Searching for:", text);
        router.push(`/search?query=${encodeURIComponent(text)}`);
    }

    const handleMoviePress = (movie: any) => {
        console.log("Movie pressed:", movie.title);
        // Navigate to movie details page
        router.push(`/movie/${movie.id}?title=${movie.title}`);
    }

    const handleFavoritePress = (movie: any) => {
        console.log("Favorite toggled for:", movie.title);
        // Handle favorite toggle logic here
        // You can implement your favorite state management here
    }

    return (
        <ScrollView
            className="flex-1 bg-dark-bg"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Welcome */}
            <View className='flex-row justify-between items-center px-4 mt-4'>
                <View className='flex-row items-center'>
                    <Image
                        style={{ width: 60, height: 60, borderRadius: 32, marginRight: 8,borderWidth:3, borderColor: CineMateColors.primary }}
                        contentFit="cover"
                        source={require('@/assets/images/logo.png')}
                        placeholder={require('@/assets/images/logo.png')}
                    />
                    <View>
                        <Text className='text-white text-lg'>Welcome Back</Text>
                        <Text className='text-white text-8xl' variant='h3' weight='bold' numberOfLines={1} ellipsizeMode='tail' >Mr. John Doe</Text>
                    </View>
                </View>
                <View>
                    <Feather name="bell" size={24} color="white" className='p-4 rounded-full bg-[#192C40]' onPress={()=>router.push("/profile/notifications")} />
                </View>
            </View>

            {/* Search Bar */}

            <View className='flex-row items-center bg-[#192C40] mx-4 mt-8 rounded-full px-4 py-2'>
                <Feather name="search" size={24} color="white" style={{ fontWeight: 'bold' }} />
                <TextInput
                    className='text-white ml-3 flex-1 font-montserrat-medium py-3 focus-visible:outline-none'
                    placeholder="Search for movies, TV shows..."
                    placeholderTextColor="#666"
                    onSubmitEditing={(event) => onSearch(event.nativeEvent.text)}
                />
            </View>

            {/* Categories */}
            <View className='mt-8 px-4'>
                <View className='flex-row items-center justify-between mb-2'>
                    <Text className="text-white text-xl" variant='h6' weight='semiBold'>Popular Categories</Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className='my-3'
                    contentContainerStyle={{ paddingHorizontal: 4, rowGap: 8, columnGap: 10 }}>
                    {movieCategories.map(category => (
                        <CategoryCard key={category.id} data={category} />
                    ))}
                </ScrollView>

                <Slider
                    data={trendingMovies}
                    renderItem={({ item }) => (
                        <MovieSliderCard
                            movie={item}
                            height={200}
                            onPress={() => handleMoviePress(item)}
                            onFavoritePress={() => handleFavoritePress(item)}
                        />
                    )}
                    autoplay
                    loop
                    pagination
                    height={200}
                    navigationButtons={false}
                    debug={false}
                    autoPlayInterval={4000}
                />
            </View>


            {/* Recommended Movies */}
            <View className='mt-8 px-4'>
                <SectionHeader
                    title="Recommended for You"
                    buttonText='View All'
                    buttonClassName='!rounded-full'
                    onButtonPress={() => router.push('/recommendation')}
                />
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ rowGap: 8, columnGap: 10, gap: 10 }}
                    nestedScrollEnabled={true}
                >
                    {recommendation.map((item,index) => (
                        <View key={index} 
                                style={{ width: (screenWidth  *(1/ 3))}}
                                className='mr-5'>
                            <MovieCard
                            data={item}
                            orientation='vertical'
                            onPress={() => handleMoviePress(item)}
                            onFavoritePress={() => handleFavoritePress(item)}
                        />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Upcoming Movies */}
            <View className='mt-8 px-4'>
                <View className='flex-row items-center justify-between mb-2'>
                    <Text className="text-white text-xl" variant='h6' weight='semiBold'>Coming Soon</Text>
                </View>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ rowGap: 8, columnGap: 10, gap: 10 }}
                    nestedScrollEnabled={true}
                >
                    {upcomingMovies.map((item, index) => (
                        <MovieCard
                            key={index}
                            data={item}
                            orientation='vertical'
                            onPress={() => handleMoviePress(item)}
                            onFavoritePress={() => handleFavoritePress(item)}
                        />
                    ))}
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const CategoryCard = memo(function CategoryCard({ data }: { data: Category }) {

    const router = useRouter();

    const onPress = () => {
        router.push(`/search?category=${encodeURIComponent(data.id)}`);
    }

    return (
        <Pressable
            className={`mb-3 rounded-xs px-5 py-2 bg-[#192C40]`}
            onPress={onPress}
        >
            <Text className="text-white text-xs" variant='smallMedium' weight='medium'>{data.name}</Text>
        </Pressable>
    );
});

const MovieSliderCard = memo(function MovieSliderCard({
    movie,
    onPress,
    onFavoritePress,
    width = screenWidth - 32,
    height = 200
}: MovieSliderCardProps) {

    // Memoize the gradient colors to prevent re-creation
    const gradientColors = React.useMemo(() => ['transparent', 'rgba(0,0,0,0.9)'] as const, []);

    // Memoize the gradient style to prevent re-creation
    const gradientStyle = React.useMemo(() => ({
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%' as const
    }), []);

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={{ width: '100%' }}
        >
            <View
                className="w-full rounded-xl overflow-hidden bg-gray-800 shadow-lg"
                style={{ height }}
            >
                <View className="relative w-full h-full">
                    <Image
                        source={{ uri: movie.poster }}
                        style={{ width: '100%', height: '100%' }}
                        contentFit="cover"
                        placeholder="https://via.placeholder.com/500x750?text=Loading..."
                    />

                    {/* Gradient overlay for better text readability */}
                    <LinearGradient
                        colors={gradientColors}
                        style={gradientStyle}
                    />

                    {/* Favorite button */}
                    <TouchableOpacity
                        className="absolute top-3 right-3 bg-[#192C40] backdrop-blur-sm p-2 rounded-sm"
                        onPress={onFavoritePress}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={movie.isFavorite ? "heart" : "heart-outline"}
                            size={20}
                            color={movie.isFavorite ? "#ef4444" : "white"}
                        />
                    </TouchableOpacity>

                    {/* Movie info overlay */}
                    <View className="absolute bottom-0 left-0 right-0 p-4">
                        <Text
                            className="text-white text-lg mb-1"
                            variant='h6'
                            weight='bold'
                            numberOfLines={2}
                        >
                            {movie.title}
                        </Text>
                        <View className="flex-row items-center">
                            <Feather name="star" size={14} color="#fbbf24" />
                            <Text className="text-gray-300 text-sm ml-1">{movie.rating}</Text>
                            <Text className="text-gray-400 text-sm ml-3">•</Text>
                            <Text className="text-gray-400 text-sm ml-1">{movie.genre}</Text>
                            <Text className="text-gray-400 text-sm ml-3">•</Text>
                            <Text className="text-gray-400 text-sm ml-1">{movie.releaseDate ? getYear(movie.releaseDate) : 'Unknown'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
});