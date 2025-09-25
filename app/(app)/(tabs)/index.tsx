import MovieCard from '@/components/movie-card';
import { Text } from '@/components/ui/app-text';
import SectionHeader from '@/components/ui/section-header';
import { CineMateColors } from '@/constants/theme';
import { useMovies } from '@/hooks/use-api';
import { Movie } from '@/types';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');


interface Category {
    id: number | string;
    name: string;
}

export default function HomeScreen() {

    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])

    const [recommendation, setRecommendation] = useState<Movie[]>([]);

    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);

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

    const handleMoviePress = (movie: Movie) => {
        router.push(`/movie/${movie.id}`);
    }

    const fetchTrendingMovies = async () => {
        try {
            const response = await useMovies.popular({ page: 1, limit: 5 });
            if (!response.success) {
                throw new Error(response.message || "Failed to load trending movies");

            }
            if (response?.data && typeof response.data === 'object' && 'movies' in response.data && Array.isArray((response.data as any).movies)) {
                setTrendingMovies((response.data as { movies: Movie[] }).movies);
            } else {
                throw new Error("Invalid response data format");
            }
        } catch (error: any) {
            ToastAndroid.show(error.message || "Failed to fetch trending movies", ToastAndroid.SHORT);
        }
    }

    // Update the movie's favorite status in the arrays
    const handleFavoritePress = useCallback((movie: Movie, category: string) => {
        let movieIndex: number;
        switch (category) {
            case "trending":
                movieIndex = trendingMovies.findIndex(m => m.id === movie.id);
                setTrendingMovies(prev => {
                    const updatedMovies = [...prev];
                    updatedMovies[movieIndex] = {
                        ...updatedMovies[movieIndex],
                        isFavorite: !updatedMovies[movieIndex].isFavorite
                    };
                    return updatedMovies;
                });
                break;
            case "recommendation":
                movieIndex = recommendation.findIndex(m => m.id === movie.id);
                setRecommendation(prev => {
                    const updatedMovies = [...prev];
                    updatedMovies[movieIndex] = {
                        ...updatedMovies[movieIndex],
                        isFavorite: !updatedMovies[movieIndex].isFavorite
                    };
                    return updatedMovies;
                });
                break;
            case "upcoming":
                movieIndex = upcomingMovies.findIndex(m => m.id === movie.id);
                setUpcomingMovies(prev => {
                    const updatedMovies = [...prev];
                    updatedMovies[movieIndex] = {
                        ...updatedMovies[movieIndex],
                        isFavorite: !updatedMovies[movieIndex].isFavorite
                    };
                    return updatedMovies;
                });
                break;
            default:
                return;
        }
    }, [recommendation, trendingMovies, upcomingMovies]);

    useEffect(() => {
        fetchTrendingMovies();
        const fetchRecommendations = async () => {
            try {
                const response = await useMovies.recommendations({ page: 1, limit: 10 });
                if (!response.success) {
                    throw new Error(response.message || "Failed to load recommendations");
                }
                if (response?.data && typeof response.data === 'object' && 'movies' in response.data && Array.isArray((response.data as any).movies)) {
                    setRecommendation((response.data as { movies: Movie[] }).movies);
                } else {
                    throw new Error("Invalid response data format");
                }
            } catch (error: any) {
                ToastAndroid.show(error.message || "Failed to fetch recommendations", ToastAndroid.SHORT);
            }
        };
        fetchRecommendations();
        const fetchUpcomingMovies = async () => {
            try {
                const response = await useMovies.comingSoon({ page: 1, limit: 10 });
                if (!response.success) {
                    throw new Error(response.message || "Failed to load upcoming movies");
                }
                if (response?.data && typeof response.data === 'object' && 'movies' in response.data && Array.isArray((response.data as any).movies)) {
                    setUpcomingMovies((response.data as { movies: Movie[] }).movies);
                } else {
                    throw new Error("Invalid response data format");
                }
            } catch (error: any) {
                ToastAndroid.show(error.message || "Failed to fetch upcoming movies", ToastAndroid.SHORT);
            }
        };
        fetchUpcomingMovies();
    }, []);

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
                        style={{ width: 60, height: 60, borderRadius: 32, marginRight: 8, borderWidth: 3, borderColor: CineMateColors.primary }}
                        contentFit="cover"
                        source={require('@/assets/images/icon.png')}
                        placeholder={require('@/assets/images/icon.png')}
                    />
                    <View>
                        <Text className='text-white text-lg'>Welcome Back</Text>
                        <Text className='text-white text-8xl' variant='h3' weight='bold' numberOfLines={1} ellipsizeMode='tail' >Mr. John Doe</Text>
                    </View>
                </View>
                <View>
                    <Feather name="bell" size={24} color="white" className='p-4 rounded-full bg-[#192C40]' onPress={() => router.push("/profile/notifications")} />
                </View>
            </View>

            {/* Search Bar */}

            <View className='flex-row items-center bg-[#192C40] mx-4 mt-8 rounded-full px-4 py-2'>
                <Feather name="search" size={24} color="white" style={{ fontWeight: 'bold' }} />
                <TextInput
                    className='text-white ml-3 flex-1 font-montserrat-medium py-3 focus-visible:outline-none'
                    placeholder="Search for movies, TV shows..."
                    placeholderTextColor="#666"
                    onEndEditing={(event) => onSearch(event.nativeEvent.text)}
                />
            </View>

            {/* Popular Movies & TV Shows */}
            <View className='mt-8'>
                <View className='px-4'>
                    <View className='flex-row items-center justify-between mb-2'>
                        <Text className="text-white text-xl" variant='h6' weight='semiBold'>Popular Movies & TV Shows</Text>
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
                </View>

                <View>
                    <Carousel
                        width={screenWidth}
                        height={screenWidth * (9 / 16)}
                        data={trendingMovies}
                        renderItem={({ item }: { item: Movie }) => (
                            <View style={{ paddingHorizontal: 16, width: screenWidth }}>
                                <MovieCard
                                    key={item.id}
                                    data={item}
                                    style={{ width: "100%", height: screenWidth * (9 / 16), }}
                                    orientation='horizontal'
                                    onPress={() => handleMoviePress(item)}
                                    onFavoritePress={() => handleFavoritePress(item, "trending")}
                                />
                            </View>
                        )}
                        autoPlay={true}
                        autoPlayInterval={4000}
                        loop={true}
                        mode="parallax"
                        onSnapToItem={(index) => setCurrentSlide(index)}
                        style={{ width: screenWidth, alignSelf: 'center' }}
                    />

                    {/* Pagination Dots */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                        {trendingMovies.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    width: index === currentSlide ? 24 : 8,
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: index === currentSlide ? CineMateColors.primary : '#666',
                                    marginHorizontal: 4,
                                }}
                                activeOpacity={0.7}
                            />
                        ))}
                    </View>
                </View>
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
                    contentContainerClassName={`pr-2 gap-3 ${Platform.OS === "web" && "overflow-x-scroll w-full custom-scrollbar"}`}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                >
                    {recommendation.map((item, index) => (
                        <View
                            key={index}
                            className='w-36'
                        >
                            <MovieCard
                                data={item}
                                orientation='vertical'
                                onPress={() => handleMoviePress(item)}
                                onFavoritePress={() => handleFavoritePress(item, "recommendation")}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Upcoming Movies */}
            <View className='mt-8 px-4'>
                <View className='flex-row items-center justify-between mb-4'>
                    <Text className="text-white text-xl" variant='h6' weight='semiBold'>Coming Soon</Text>
                </View>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName={`pr-2 gap-3 ${Platform.OS === "web" && "overflow-x-scroll w-full custom-scrollbar"}`}
                    nestedScrollEnabled={true}
                >
                    {upcomingMovies.map((item, index) => {
                        const formatedDate = item?.releaseDate ? new Date(item?.releaseDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }) : "Unknown";
                        const movie = { ...item, subTitle: `On: ${formatedDate}` };
                        return (
                            <View
                                key={index}
                                className='w-36'
                            >
                                <MovieCard
                                    data={movie}
                                    orientation='vertical'
                                    onPress={() => handleMoviePress(item)}
                                    onFavoritePress={() => handleFavoritePress(item, "upcoming")}
                                />
                            </View>)
                    }
                    )}
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const CategoryCard = memo(function CategoryCard({ data }: { data: Category }) {

    const router = useRouter();

    const onPress = async () => {
        try {
            let category = data.name;
            // If "All" is selected, just route to search page without filter
            if (category === "All") {
                router.push(`/search?category=All`);
                return;
            }
            // Fetch movies by category using useMovies.search
            const response = await useMovies.search({ q: "", filter: category, page: 1, limit: 20 });
            if (response.success && response.data && typeof response.data === 'object' && 'movies' in response.data) {
                // Pass results to search page via router (could use state management or params)
                // For now, route with category param
                router.push(`/search?category=${encodeURIComponent(category)}`);
            } else {
                ToastAndroid.show(response.message || "No movies found for this category", ToastAndroid.SHORT);
            }
        } catch (error: any) {
            ToastAndroid.show(error.message || "Failed to fetch category movies", ToastAndroid.SHORT);
        }
    };

    return (
        <Pressable
            className={`mb-3 rounded-xs px-5 py-2 bg-[#192C40]`}
            onPress={onPress}
        >
            <Text className="text-white text-xs" variant='smallMedium' weight='medium'>{data.name}</Text>
        </Pressable>
    );
});
