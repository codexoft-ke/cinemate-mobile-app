import MovieCard from '@/components/movie-card';
import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import SectionHeader from '@/components/ui/section-header';
import { ApiError, useMovies } from '@/hooks/use-api';
import { Movie } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Platform, RefreshControl, ScrollView, View, ActivityIndicator } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

export default function Recommendation() {
    // Card dimensions for horizontal scroll
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = 150; // Minimum card width
    const padding = 32; // Total horizontal padding (16px on each side)
    const spacing = 8; // Space between cards

    const toast = useToast();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [recommendedForYou, setRecommendedForYou] = useState<Movie[]>([]);

    const handleMoviePress = (movie: Movie) => {
        router.push(`/movie/${movie.id}`);
    }

    const numColumns = useMemo(() => {
        const availableWidth = screenWidth - padding;
        const columns = Math.floor(availableWidth / (cardWidth + spacing));
        return Math.max(2, columns); // Minimum 2 columns
    }, [screenWidth]);

    const refreshMovies = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await fetchRecommendations();
        } catch (error) {
            console.log(error)
        } finally {
            setIsRefreshing(false)
        }
    }, [])

    const fetchRecommendations = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await useMovies.recommendations();
            if (!response.success) {
                throw new Error(response.message || "Failed to load movies");

            }
            if (response?.data && typeof response.data === 'object' && 'movies' in response.data && Array.isArray((response.data as any).movies)) {
                setRecommendedForYou((response.data as { movies: Movie[] }).movies);
            } else {
                throw new Error("Invalid response data format");
            }
        } catch (error) {
            const apiError = error as ApiError;
            toast.show(apiError.message || "Failed to fetch movies", { type: "danger" });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch trending movies on component mount
    useEffect(() => {
        fetchRecommendations();
    }, []);

    const handleFavoritePress = useCallback((movie: Movie) => {
        const removeFavourite = async () => {
            const loadingToastId = toast.show("Removing from favourites...", { type: "normal", placement: "top", duration: 0, animationType: "slide-in" });
            try {
                const response = await useMovies.removeFromFavourites({ movie_id: movie.id })
                if (response.success) {
                    setRecommendedForYou((prev) => {
                        const previousData = prev;
                        return previousData.filter((movies) => movie.id !== movies.id);
                    })
                    toast.show("Removed from favourites", { type: "success" });
                    return;
                }
                throw response as ApiError;
            } catch (error) {
                const apiError = error as ApiError;
                toast.show(apiError.message || "Failed to remove from favourites", { type: "danger" });
            } finally {
                toast.hide(loadingToastId);
            }
        }
        removeFavourite();
    }, [recommendedForYou]);

    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Recommendation' />
            <View className="px-4 mt-4 flex-1">
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <FlashList
                        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshMovies} />}
                        data={recommendedForYou}
                        keyExtractor={(item: Movie) => item.id.toString()}
                        renderItem={({ item, index }: { item: Movie; index: number }) => (
                            <View style={{
                                flex: 1,
                                marginLeft: index % numColumns === 0 ? 0 : 4,
                                marginRight: index % numColumns === numColumns - 1 ? 0 : 4
                            }}>
                                <MovieCard
                                    data={item}
                                    style={{ width: "100%" }}
                                    onPress={() => handleMoviePress(item)}
                                    onFavoritePress={() => handleFavoritePress(item)} />
                            </View>
                        )}
                        numColumns={numColumns}
                        key={numColumns} // Force re-render when numColumns changes
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        ListEmptyComponent={() => (
                            <View className="flex-1 items-center justify-center mt-10">
                                <Text className="text-gray-400 font-montserrat-medium">No results found</Text>
                            </View>
                        )}
                        contentContainerClassName='pb-10 custom-scrollbar'
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>
        </View >
    );
}