import MovieCard from '@/components/movie-card';
import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { ApiError, useMovies } from '@/hooks/use-api';
import { Movie } from '@/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { Toast } from 'react-native-toast-notifications';

export default function SearchScreen() {
    // API hook at component level
    const moviesApi = useMovies;

    const [movies, setMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>('');
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);

    // Filter states
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedYearRange, setSelectedYearRange] = useState<{ min: number; max: number } | null>(null);
    const [selectedRatingRange, setSelectedRatingRange] = useState<{ min: number; max: number } | null>(null);
    const [selectedContentType, setSelectedContentType] = useState<'all' | 'movie' | 'series'>('all');

    // Refs for preventing stale closures
    const currentPageRef = useRef(currentPage);
    const hasNextPageRef = useRef(hasNextPage);
    const loadingMoreRef = useRef(loadingMore);

    // Update refs when state changes
    useEffect(() => {
        currentPageRef.current = currentPage;
    }, [currentPage]);

    useEffect(() => {
        hasNextPageRef.current = hasNextPage;
    }, [hasNextPage]);

    useEffect(() => {
        loadingMoreRef.current = loadingMore;
    }, [loadingMore]);

    // Available filter options
    const availableGenres = [
        'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Family',
        'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction',
        'Thriller', 'War', 'Western', 'Supernatural'
    ];

    const yearRanges = [
        { label: '2020s', min: 2020, max: 2025 },
        { label: '2010s', min: 2010, max: 2019 },
        { label: '2000s', min: 2000, max: 2009 },
        { label: '1990s', min: 1990, max: 1999 },
        { label: '1980s', min: 1980, max: 1989 },
        { label: 'Classic (Before 1980)', min: 1900, max: 1979 }
    ];

    const ratingRanges = [
        { label: '9.0+ Masterpiece', min: 9.0, max: 10.0 },
        { label: '8.0+ Excellent', min: 8.0, max: 8.9 },
        { label: '7.0+ Good', min: 7.0, max: 7.9 },
        { label: '6.0+ Decent', min: 6.0, max: 6.9 },
        { label: 'All Ratings', min: 0, max: 10.0 }
    ];

    // Memoized screen calculations with throttling
    const screenDimensions = useMemo(() => {
        const screenWidth = Dimensions.get('window').width;
        const cardWidth = 150;
        const padding = 32;
        const spacing = 8;
        const availableWidth = screenWidth - padding;
        const columns = Math.floor(availableWidth / (cardWidth + spacing));
        
        return {
            numColumns: Math.max(2, columns),
            cardWidth,
            spacing
        };
    }, []); // Only calculate once, or add screen width listener if needed

    // Fixed applyFilters without searchQuery in dependencies
    const applyFilters = useCallback((movieList: Movie[], query: string = '') => {
        let filtered = movieList;

        // Text search filter
        if (query.trim() !== '') {
            filtered = filtered.filter((movie: Movie) =>
                (movie.title?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
                (Array.isArray(movie.genre) && (movie.genre as string[]).some((g: string) => g.toLowerCase().includes(query.toLowerCase()))) ||
                (movie.synopsis?.toLowerCase().includes(query.toLowerCase()) ?? false)
            );
        }

        // Genre filter
        if (selectedGenres.length > 0) {
            filtered = filtered.filter((movie: Movie) => {
                if (Array.isArray(movie.genre)) {
                    return (movie.genre as string[]).some(g => selectedGenres.includes(g));
                } else if (typeof movie.genre === 'string') {
                    return selectedGenres.includes(movie.genre);
                }
                return false;
            });
        }

        // Year range filter
        if (selectedYearRange) {
            filtered = filtered.filter((movie: Movie) => {
                if (movie.releaseDate) {
                    const year = new Date(movie.releaseDate).getFullYear();
                    return year >= selectedYearRange.min && year <= selectedYearRange.max;
                }
                return false;
            });
        }

        // Rating range filter
        if (selectedRatingRange) {
            filtered = filtered.filter((movie: Movie) => {
                if (movie.rating) {
                    return movie.rating >= selectedRatingRange.min && movie.rating <= selectedRatingRange.max;
                }
                return false;
            });
        }

        // Content type filter
        if (selectedContentType !== 'all') {
            filtered = filtered.filter((movie: Movie) => {
                if (selectedContentType === 'series') {
                    return movie.isSeries === true;
                } else {
                    return movie.isSeries !== true;
                }
            });
        }

        return filtered;
    }, [selectedGenres, selectedYearRange, selectedRatingRange, selectedContentType]);

    // Improved search function
    const handleSearch = useCallback(async (query: string, page: number, isLoadMore: boolean = false) => {
        try {
            if (page === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            // Use the hook properly
            const response = await moviesApi.search({ q: query, page });
            
            if (!response.success) {
                Toast.show(response.message || "Failed to search movies", {
                    type: "danger",
                    duration: 3000
                });
                if (page === 1) {
                    setMovies([]);
                    setHasNextPage(false);
                }
                return;
            }

            if (response.data && typeof response.data === 'object' && 'movies' in response.data && Array.isArray((response.data as any).movies)) {
                const newMovies = (response.data as { movies: Movie[] }).movies;
                
                if (page === 1) {
                    setMovies(newMovies);
                } else {
                    setMovies(prev => [...prev, ...newMovies]);
                }
                
                // Check if there are more pages (adjust logic based on your API response)
                setHasNextPage(newMovies.length > 0);
            } else {
                throw new Error("Invalid response data format");
            }
        } catch (error) {
            console.error('Search error:', error);
            Toast.show("An error occurred while searching", {
                type: "danger",
                duration: 3000
            });
            if (page === 1) {
                setMovies([]);
                setHasNextPage(false);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [moviesApi]);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 400);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Reset pagination and search when query or filters change
    useEffect(() => {
        setCurrentPage(1);
        setHasNextPage(true);
        if (debouncedQuery.trim()) {
            handleSearch(debouncedQuery, 1);
        } else {
            setMovies([]);
        }
    }, [debouncedQuery, handleSearch]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
        if (debouncedQuery.trim()) {
            handleSearch(debouncedQuery, 1);
        }
    }, [selectedGenres, selectedYearRange, selectedRatingRange, selectedContentType]);

    // Apply filters locally to fetched movies
    useEffect(() => {
        setFilteredMovies(applyFilters(movies, debouncedQuery));
    }, [movies, applyFilters, debouncedQuery]);

    // Update filters function
    const updateFilters = useCallback(() => {
        setShowFilterModal(false);
        // Pagination reset and search will be handled by the filter change useEffect
    }, []);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setSelectedGenres([]);
        setSelectedYearRange(null);
        setSelectedRatingRange(null);
        setSelectedContentType('all');
    }, []);

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => 
        selectedGenres.length > 0 || 
        selectedYearRange !== null || 
        selectedRatingRange !== null || 
        selectedContentType !== 'all'
    , [selectedGenres.length, selectedYearRange, selectedRatingRange, selectedContentType]);

    const handleMoviePress = useCallback((movie: Movie) => {
        router.push(`/movie/${movie.id}`);
    }, []);

    // Fixed favorite handling - update the movie state instead of removing
    const handleFavoritePress = useCallback(async (movie: Movie) => {
        const loadingToastId = Toast.show("Updating favourites...", { 
            type: "normal", 
            placement: "top", 
            duration: 0, 
            animationType: "slide-in" 
        });
        
        try {
            const response = await moviesApi.removeFromFavourites({ movie_id: movie.id });
            
            if (response.success) {
                // Update the movie's favorite status instead of removing it
                setMovies(prev => 
                    prev.map(m => 
                        m.id === movie.id 
                            ? { ...m, isFavorited: false } 
                            : m
                    )
                );
                Toast.show("Removed from favourites", { type: "success" });
            } else {
                throw response as ApiError;
            }
        } catch (error) {
            const apiError = error as ApiError;
            Toast.show(apiError.message || "Failed to remove from favourites", { 
                type: "danger" 
            });
        } finally {
            toast.hideAll();
        }
    }, [moviesApi]);

    // Fixed pagination handler
    const handleLoadMore = useCallback(() => {
        if (!hasNextPageRef.current || loadingMoreRef.current || loading) {
            return;
        }
        
        const nextPage = currentPageRef.current + 1;
        setCurrentPage(nextPage);
        handleSearch(debouncedQuery, nextPage, true);
    }, [debouncedQuery, handleSearch, loading]);

    return (
        <View className="flex-1 bg-dark-bg">
            <AppHeader title='Search' />

            {/* Search Bar */}
            <View className="flex-row items-center bg-[#192C40] mx-4 mt-3 rounded-full px-4 py-2">
                <Feather name="search" size={24} color="white" style={{ fontWeight: 'bold' }} />
                <TextInput
                    className="text-white ml-3 flex-1 font-montserrat-medium py-2 focus-visible:outline-none"
                    placeholder="Search for movies, TV shows..."
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                />
                <TouchableOpacity
                    onPress={() => setShowFilterModal(true)}
                    className={`p-1 rounded-full ${hasActiveFilters ? 'bg-primary' : ''}`}
                >
                    <Feather
                        name="sliders"
                        size={24}
                        color="white"
                        style={{ fontWeight: 'bold' }}
                    />
                </TouchableOpacity>
            </View>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <View className="mx-4 mt-1">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className='py-2'
                    >
                        <View className="flex-row items-center gap-1.5">
                            <TouchableOpacity
                                onPress={clearAllFilters}
                                className="bg-red-500/20 border border-red-500/50 rounded-xl px-2.5 py-0.5 flex-row items-center"
                            >
                                <Ionicons name="trash-bin" size={10} color="#EF4444" />
                                <Text className="text-red-400 text-xs font-semibold ml-1">Clear All</Text>
                            </TouchableOpacity>
                            
                            {selectedGenres.map((genre) => (
                                <View key={genre} className="bg-primary/20 border border-primary/50 rounded-xl px-2 py-0.5 flex-row items-center">
                                    <Ionicons name="color-palette" size={10} color="#9810FA" />
                                    <Text className="text-primary text-xs font-semibold ml-1 mr-1">{genre}</Text>
                                    <TouchableOpacity onPress={() => setSelectedGenres(prev => prev.filter(g => g !== genre))}>
                                        <Ionicons name="close-circle" size={14} color="#9810FA" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {selectedYearRange && (
                                <View className="bg-primary/20 border border-primary/50 rounded-xl px-2 py-0.5 flex-row items-center">
                                    <Ionicons name="calendar" size={10} color="#9810FA" />
                                    <Text className="text-primary text-xs font-semibold ml-1 mr-1">
                                        {yearRanges.find(r => r.min === selectedYearRange.min && r.max === selectedYearRange.max)?.label}
                                    </Text>
                                    <TouchableOpacity onPress={() => setSelectedYearRange(null)}>
                                        <Ionicons name="close-circle" size={14} color="#9810FA" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {selectedRatingRange && (
                                <View className="bg-primary/20 border border-primary/50 rounded-xl px-2 py-0.5 flex-row items-center">
                                    <Ionicons name="star" size={10} color="#FFD700" />
                                    <Text className="text-primary text-xs font-semibold ml-1 mr-1">
                                        {ratingRanges.find(r => r.min === selectedRatingRange.min && r.max === selectedRatingRange.max)?.label}
                                    </Text>
                                    <TouchableOpacity onPress={() => setSelectedRatingRange(null)}>
                                        <Ionicons name="close-circle" size={14} color="#9810FA" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {selectedContentType !== 'all' && (
                                <View className="bg-primary/20 border border-primary/50 rounded-xl px-2 py-0.5 flex-row items-center">
                                    <Ionicons
                                        name={selectedContentType === 'movie' ? 'film' : 'tv'}
                                        size={10}
                                        color="#9810FA"
                                    />
                                    <Text className="text-primary text-xs font-semibold ml-1 mr-1">
                                        {selectedContentType === 'movie' ? 'Movies' : 'Series'}
                                    </Text>
                                    <TouchableOpacity onPress={() => setSelectedContentType('all')}>
                                        <Ionicons name="close-circle" size={14} color="#9810FA" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Search Results */}
            <View className="px-4 mt-1 flex-1">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#9810FA" />
                        <Text className="text-gray-400 font-montserrat-medium mt-2">Searching...</Text>
                    </View>
                ) : (
                    <FlashList
                        data={filteredMovies}
                        keyExtractor={(item: Movie) => item.id.toString()}
                        renderItem={({ item, index }: { item: Movie; index: number }) => (
                            <View style={{
                                flex: 1,
                                marginLeft: index % screenDimensions.numColumns === 0 ? 0 : 4,
                                marginRight: index % screenDimensions.numColumns === screenDimensions.numColumns - 1 ? 0 : 4
                            }}>
                                <MovieCard
                                    data={item}
                                    style={{ width: "100%" }}
                                    onPress={() => handleMoviePress(item)}
                                    onFavoritePress={() => handleFavoritePress(item)} 
                                />
                            </View>
                        )}
                        numColumns={screenDimensions.numColumns}
                        key={screenDimensions.numColumns}
                        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.1}
                        ListEmptyComponent={() => (
                            <View className="flex-1 items-center justify-center mt-10">
                                <Text className="text-gray-400 font-montserrat-medium">
                                    {debouncedQuery.trim() ? 'No results found' : 'Enter a search query'}
                                </Text>
                            </View>
                        )}
                        ListFooterComponent={() => loadingMore ? (
                            <View style={{ paddingVertical: 24 }}>
                                <ActivityIndicator size="large" color="#9810FA" />
                            </View>
                        ) : null}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                )}
            </View>

            {/* Filter Modal - Keep existing modal code */}
            <Modal
                visible={showFilterModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View className='flex-1 bg-black/50 backdrop-blur-sm justify-end'>
                    <View className='max-w-[600px] max-h-[600px] self-center flex-1 rounded-t-xl bg-dark-bg'>
                        {/* Modal Header */}
                        <View className='flex-row items-center justify-between px-5 py-3 border-b-2 border-alt-bg'>
                            <Text className='text-white text-lg' color='#FFFFFF' variant='h4' weight='bold'>Filters</Text>
                            <TouchableOpacity
                                onPress={() => setShowFilterModal(false)}
                                className='p-2'
                            >
                                <Ionicons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        {/* Scrollable Content */}
                        <ScrollView
                            className='flex-1'
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 80 }}
                        >
                            {/* Content Type Filter */}
                            <View className='px-5 pt-4'>
                                <Text className='text-lg mb-2' variant='h6' color='#FFFFFF' weight='semiBold'>
                                    Content Type
                                </Text>
                                <View className='flex-row gap-2'>
                                    <TouchableOpacity
                                        onPress={() => setSelectedContentType('all')}
                                        className='flex-1 px-4 py-3 rounded-lg items-center'
                                        style={{
                                            backgroundColor: selectedContentType === 'all' ? '#9810FA' : '#374151',
                                        }}
                                    >
                                        <Text color="white" weight='semiBold' variant='small'>All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setSelectedContentType('movie')}
                                        className='flex-1 px-4 py-3 rounded-lg items-center'
                                        style={{
                                            backgroundColor: selectedContentType === 'movie' ? '#9810FA' : '#374151',
                                        }}
                                    >
                                        <Text color="white" weight='semiBold' variant='small'>Movies</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setSelectedContentType('series')}
                                        className='flex-1 px-4 py-3 rounded-lg items-center'
                                        style={{
                                            backgroundColor: selectedContentType === 'series' ? '#9810FA' : '#374151',
                                        }}
                                    >
                                        <Text color="white" weight='semiBold' variant='small'>Series</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Genres Filter */}
                            <View className='p-5'>
                                <Text className='text-lg mb-2' variant='h6' color='#FFFFFF' weight='semiBold'>
                                    Genres
                                </Text>
                                <View className='flex-row flex-wrap gap-2'>
                                    {availableGenres.map((genre) => (
                                        <TouchableOpacity
                                            key={genre}
                                            onPress={() => {
                                                setSelectedGenres(prev =>
                                                    prev.includes(genre)
                                                        ? prev.filter(g => g !== genre)
                                                        : [...prev, genre]
                                                );
                                            }}
                                            className={`px-3 py-2 rounded-full ${selectedGenres.includes(genre) ? 'bg-purple-600' : 'bg-gray-700'}`}
                                        >
                                            <Text color='white' weight='semiBold' variant='small'>
                                                {genre}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Release Year Filter */}
                            <View className='p-5'>
                                <Text className='text-lg mb-2' variant='h6' color='#FFFFFF' weight='semiBold'>
                                    Release Year
                                </Text>
                                <View className='flex-row flex-wrap gap-2'>
                                    {yearRanges.map((range) => (
                                        <TouchableOpacity
                                            key={range.label}
                                            onPress={() => {
                                                if (selectedYearRange && selectedYearRange.min === range.min && selectedYearRange.max === range.max) {
                                                    setSelectedYearRange(null);
                                                } else {
                                                    setSelectedYearRange({ min: range.min, max: range.max });
                                                }
                                            }}
                                            className="px-3 py-2 rounded-lg flex-row items-center justify-between"
                                            style={{
                                                backgroundColor: selectedYearRange && selectedYearRange.min === range.min && selectedYearRange.max === range.max ? '#9810FA' : '#374151',
                                            }}
                                        >
                                            <Text color='white' weight='semiBold' variant='small'>
                                                {range.label}
                                            </Text>
                                            {selectedYearRange && selectedYearRange.min === range.min && selectedYearRange.max === range.max && (
                                                <Ionicons name="checkmark" size={18} color="white" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Rating Filter */}
                            <View className='p-5'>
                                <Text className='text-lg mb-2' variant='h6' color='#FFFFFF' weight='semiBold'>
                                    Rating
                                </Text>
                                <View className='gap-2'>
                                    {ratingRanges.map((range) => (
                                        <TouchableOpacity
                                            key={range.label}
                                            onPress={() => {
                                                if (selectedRatingRange && selectedRatingRange.min === range.min && selectedRatingRange.max === range.max) {
                                                    setSelectedRatingRange(null);
                                                } else {
                                                    setSelectedRatingRange({ min: range.min, max: range.max });
                                                }
                                            }}
                                            className={`py-3 px-4 rounded-lg flex-row items-center justify-between ${selectedRatingRange && selectedRatingRange.min === range.min && selectedRatingRange.max === range.max ? 'bg-purple-600' : 'bg-gray-700'}`}
                                        >
                                            <View className='flex-row items-center'>
                                                <Text className={`text-white ${selectedRatingRange && selectedRatingRange.min === range.min && selectedRatingRange.max === range.max ? 'font-bold' : 'font-normal'}`}>
                                                    {range.label}
                                                </Text>
                                                {range.min > 0 && range.min < 10 && (
                                                    <View className='flex-row items-center ml-2'>
                                                        {[...Array(Math.floor(range.min))].map((_, i) => (
                                                            <Ionicons key={i} name="star" size={12} color="#FFD700" />
                                                        ))}
                                                    </View>
                                                )}
                                            </View>
                                            {selectedRatingRange && selectedRatingRange.min === range.min && selectedRatingRange.max === range.max && (
                                                <Ionicons name="checkmark" size={18} color="white" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        {/* Apply Button */}
                        <View className='p-6 border-t-2 border-t-alt-bg'>
                            <TouchableOpacity onPress={updateFilters} className='bg-primary p-4 rounded-md items-center'>
                                <Text variant='h6' weight='bold' color="white">
                                    Apply Filters {hasActiveFilters ? `(${selectedGenres.length +
                                        (selectedYearRange ? 1 : 0) +
                                        (selectedRatingRange ? 1 : 0) +
                                        (selectedContentType !== 'all' ? 1 : 0)
                                        })` : ''}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}