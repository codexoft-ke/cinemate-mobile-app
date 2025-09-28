import MovieCard from '@/components/movie-card';
import { Text } from '@/components/ui/app-text';
import SectionHeader from '@/components/ui/section-header';
import { CineMateColors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useMovies } from '@/hooks/use-api';
import { Movie } from '@/types';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useToast } from "react-native-toast-notifications";

const { width: screenWidth } = Dimensions.get('window');


interface Category {
    id: number | string;
    name: string;
    movieCount?: number; // Optional count of movies in this category
}

export default function HomeScreen() {

    const router = useRouter();
    const toast = useToast();
    const {user} = useAuth();

    const [currentSlide, setCurrentSlide] = useState(0);

    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
    const [filteredTrendingMovies, setFilteredTrendingMovies] = useState<Movie[]>([])

    const [recommendation, setRecommendation] = useState<Movie[]>([]);

    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
    const [movieCategories, setMovieCategories] = useState<Category[]>([]);

    const [activeCategory, setActiveCategory] = useState<Category["id"]>("All");

    const onSearch = (text: string) => {
        console.log("Searching for:", text);
        router.push(`/search?query=${encodeURIComponent(text)}`);
    }

    const handleMoviePress = (movie: Movie) => {
        router.push(`/movie/${movie.id}`);
    }

    const onCategoryPress = (category: Category) => {
        setActiveCategory(category.id);
        switch (category.id) {
            case "All":
                setFilteredTrendingMovies(trendingMovies);
                break;
        
            default:
                const filtered = trendingMovies.filter(movie => {
                    const genres = movie.genres || movie.genre;
                    if (genres) {
                        const genreList = Array.isArray(genres) ? genres : [genres];
                        return genreList.includes(category.name);
                    }
                    return false;
                });
                setFilteredTrendingMovies(filtered);
                break;
        }
    }

    // Update the movie's favorite status in the arrays
    const handleFavoritePress = useCallback(async (movie: Movie, category: string) => {
        const loadingToastId = toast.show("Updating favorite status...", { type: "normal", placement: "top", duration: 0, animationType: "slide-in" });
        try {
            let response;
            if (movie.is_favorite) {
                // If already favorite, remove from favorites
                response = await useMovies.removeFromFavourites({ movie_id: movie.id });
            } else {
                // If not favorite, add to favorites
                response = await useMovies.addToFavourites({ movie_id: movie.id });
            }
            if (!response.success) {
                throw new Error(response.message || "Failed to update favorite status");
            }
            toast.show(response.message || "Favorite status updated", { type: movie.is_favorite ? "danger" : "success", placement: "top", duration: 2500, animationType: "slide-in" });
            const updatedMovie = { ...movie, is_favorite: !movie.is_favorite };            

            if (category === "trending") {
                setTrendingMovies(prevMovies => prevMovies.map(m => m.id === movie.id ? updatedMovie : m));
                setFilteredTrendingMovies(prevMovies => prevMovies.map(m => m.id === movie.id ? updatedMovie : m));
            } else if (category === "recommendation") {
                setRecommendation(prevMovies => prevMovies.map(m => m.id === movie.id ? updatedMovie : m));
            } else if (category === "upcoming") {
                setUpcomingMovies(prevMovies => prevMovies.map(m => m.id === movie.id ? updatedMovie : m));
            }
        } catch (error: any) {
            toast.show(error.message || "Failed to update favorite status", { type: "danger" });
        } finally {
            toast.hideAll();
        }
    }, [recommendation, trendingMovies, upcomingMovies]);

    useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                const response = await useMovies.popular({ page: 1, limit: 5 });
                if (!response.success) {
                    throw new Error(response.message || "Failed to load trending movies");

                }
                if (response?.data && typeof response.data === 'object' && 'movies' in response.data && Array.isArray((response.data as any).movies)) {
                    const movies = (response.data as { movies: Movie[] }).movies;
                    setTrendingMovies(movies);

                    // Collect genre counts
                    const genreCountMap: Record<string, number> = {};
                    movies.forEach(movie => {
                        const genres = movie.genres || movie.genre;
                        if (genres) {
                            const genreList = Array.isArray(genres) ? genres : [genres];
                            genreList.forEach((genre: string) => {
                                genreCountMap[genre] = (genreCountMap[genre] || 0) + 1;
                            });
                        }
                    });

                    // Add "All" category first
                    const categories: Category[] = [
                        { id: "All", name: "All", movieCount: movies.length },
                        ...Object.entries(genreCountMap).map(([genre, count]) => ({
                            id: genre,
                            name: genre,
                            movieCount: count,
                        }))
                    ];
                    setMovieCategories(categories);

                    setFilteredTrendingMovies(movies);
                } else {
                    throw new Error("Invalid response data format");
                }
            } catch (error: any) {
                toast.show(error.message || "Failed to fetch trending movies", { type: "danger" });
            }
        }
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
                toast.show(error.message || "Failed to fetch recommendations", { type: "danger" });
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
                toast.show(error.message || "Failed to fetch upcoming movies", { type: "danger" });
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
                    <View style={{ maxWidth: screenWidth - 140 }}>
                        <Text className='text-white text-lg'>Welcome Back</Text>
                        <Text
                            className='text-white text-8xl'
                            variant='h3'
                            weight='bold'
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >
                            {user?.name?.split(' ').slice(0, 2).join(' ')}
                        </Text>
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
                        {movieCategories.map((category, index) => (
                            <Pressable
                                key={index}
                                className={`mb-3 rounded-xs px-5 py-2 bg-[#192C40] ${activeCategory === category.id ? 'bg-primary' : ''}`}
                                onPress={()=>onCategoryPress(category)}
                            >
                                <Text className="text-white text-xs" variant='smallMedium' weight='medium'>{category.name} ({category.movieCount})</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                <View>
                    <Carousel
                        width={screenWidth}
                        height={screenWidth * (9 / 16)}
                        data={filteredTrendingMovies || trendingMovies}
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
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
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
                    </View> */}
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
                        const formatedDate = item?.release_date ? new Date(item?.release_date).toLocaleDateString('en-US', {
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