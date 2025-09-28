import { Text } from '@/components/ui/app-text';
import SectionHeader from '@/components/ui/section-header';
import StarRating from '@/components/ui/star-rating';
import { BorderRadius, CineMateColors, Shadows, Spacing } from '@/constants/theme';
import { useMovies } from '@/hooks/use-api';
import { CastInfo, EpisodeInfo, ReviewInfo, VideoInfo } from '@/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useGlobalSearchParams } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Dimensions, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

// Constants
const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTHS = {
    CAST: 100,
    VIDEO: 200,
    EPISODE: 220
} as const;

const DEFAULT_IMAGES = {
    backdrop: require('@/assets/images/logo.png'),
    poster: require("@/assets/images/icon.png"),
    profile: require("@/assets/images/icon.png")
} as const;

// Types
interface MovieDetails {
    id?: string;
    is_series?: boolean;
    is_favorite?: boolean;
    title?: string;
    language?: string;
    release_date?: string;
    rating?: number;
    runtime?: number | null;
    network_logo?: string | null;
    backdrop_url?: string;
    poster_url?: string;
    genres?: string[];
    synopsis?: string;
    homepage?: string;
    cast?: CastInfo[];
    videos?: VideoInfo[];
    reviews?: ReviewInfo[];
    recommendations?: Array<{
        id?: string;
        title?: string;
        poster?: string;
        backdrop?: string;
        synopsis?: string;
        release_date?: string;
        duration?: number | null;
        genres?: string[];
        rating?: number;
        is_favorite?: boolean;
        is_series?: boolean;
    }>;
    seasons?: Array<{
        id?: number;
        air_date?: string;
        episode_count?: number;
        name?: string;
        overview?: string;
        poster_path?: string;
        season_number?: number;
        vote_average?: number;
        episodes?: EpisodeInfo[];
    }>;
}

interface MovieInfoError {
    message: string;
    type: 'network' | 'api' | 'unknown';
}

// Custom hooks
const useMovieDetails = (movieId: string, toast: any) => {
    const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<MovieInfoError | null>(null);

    const fetchMovieDetails = useCallback(async () => {
        if (!movieId) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await useMovies.details(movieId);
            if ('success' in response && response.success && response.data && (response.data as any).movie) {
                setMovieDetails((response.data as { movie?: MovieDetails }).movie ?? null);
            } else {
                throw new Error('message' in response && response.message ? response.message : "Failed to load movie details");
            }
        } catch (err) {
            const error: MovieInfoError = {
                message: err instanceof Error ? err.message : "Failed to fetch movie details",
                type: err instanceof Error && err.message.includes('network') ? 'network' : 'api'
            };
            setError(error);
            toast.show(error.message, { type: "danger" });
        } finally {
            setIsLoading(false);
        }
    }, [movieId, toast]);

    const retryFetch = useCallback(() => {
        fetchMovieDetails();
    }, [fetchMovieDetails]);

    useEffect(() => {
        fetchMovieDetails();
    }, [fetchMovieDetails]);

    return { movieDetails, isLoading, error, retryFetch };
};

const useVideoModal = () => {
    const [isVideoModalVisible, setIsVideoModalVisible] = useState<boolean>(false);
    const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);

    const openVideo = useCallback((video: VideoInfo) => {
        setSelectedVideo(video);
        setIsVideoModalVisible(true);
    }, []);

    const closeVideo = useCallback(() => {
        setIsVideoModalVisible(false);
        setSelectedVideo(null);
    }, []);

    const handleModalRequestClose = useCallback(() => {
        if (Platform.OS === 'web') {
            return; // Only allow explicit close via close button on web
        }
        closeVideo();
    }, [closeVideo]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isVideoModalVisible) {
                setIsVideoModalVisible(false);
                setSelectedVideo(null);
            }
        };
    }, [isVideoModalVisible]);

    return {
        isVideoModalVisible,
        selectedVideo,
        openVideo,
        closeVideo,
        handleModalRequestClose
    };
};

export default function MovieInfo() {
    const toast = useToast();
    const { id: movieId } = useGlobalSearchParams();
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    
    const { movieDetails, isLoading, error, retryFetch } = useMovieDetails(
        Array.isArray(movieId) ? movieId[0] : movieId || '', 
        toast
    );
    
    const {
        isVideoModalVisible,
        selectedVideo,
        openVideo,
        closeVideo,
        handleModalRequestClose
    } = useVideoModal();

    // Memoized computations
    const movieInfo = useMemo(() => {
        if (!movieDetails) return null;
        
        return {
            year: movieDetails.release_date?.split('-')[0] || 'N/A',
            formattedRating: movieDetails.rating ? Number(movieDetails.rating).toFixed(1) : 'N/A',
            safeGenres: movieDetails.genres || [],
            safeCast: movieDetails.cast || [],
            safeVideos: movieDetails.videos || [],
            safeReviews: movieDetails.reviews || [],
            safeSeasons: movieDetails.seasons || []
        };
    }, [movieDetails]);

    const filteredEpisodes = useMemo(() => {
        if (!movieInfo?.safeSeasons.length) return [];
        const season = movieInfo.safeSeasons.find(s => s.season_number === selectedSeason);
        return season?.episodes || [];
    }, [movieInfo?.safeSeasons, selectedSeason]);

    // Event handlers
    const handleSeasonChange = useCallback((seasonNumber: number) => {
        setSelectedSeason(seasonNumber);
    }, []);

    const handleBackPress = useCallback(() => {
        router.back();
    }, []);

    const handleFavoritePress = useCallback(() => {
        // TODO: Implement favorite functionality
        toast.show('Favorite functionality not implemented', { type: 'info' });
    }, [toast]);

    const handleRetry = useCallback(() => {
        retryFetch();
    }, [retryFetch]);

    // Loading state
    if (isLoading && !movieDetails) {
        return (
            <View className="flex-1 items-center justify-center bg-dark-bg">
                <View className="p-6 bg-alt-bg/80 rounded-lg items-center">
                    <ActivityIndicator size="large" color="#9810FA" />
                    <Text variant="h6" weight="bold" className="text-white mt-3">
                        Loading movie details...
                    </Text>
                </View>
            </View>
        );
    }

    // Error state
    if (error && !movieDetails) {
        return (
            <View className="flex-1 items-center justify-center bg-dark-bg px-4">
                <View className="p-6 bg-alt-bg/80 rounded-lg items-center">
                    <Feather name="alert-circle" size={48} color="#ef4444" />
                    <Text variant="h6" weight="bold" className="text-white mt-3 text-center">
                        Failed to load movie details
                    </Text>
                    <Text variant="small" weight="regular" className="text-gray-400 mt-2 text-center">
                        {error.message}
                    </Text>
                    <TouchableOpacity
                        className="mt-4 bg-primary px-6 py-3 rounded-lg"
                        onPress={handleRetry}
                        activeOpacity={0.8}
                    >
                        <Text variant="small" weight="semiBold" className="text-white">
                            Retry
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (!movieDetails || !movieInfo) {
        return (
            <View className="flex-1 items-center justify-center bg-dark-bg">
                <Text variant="h6" weight="bold" className="text-white">
                    No movie data available
                </Text>
            </View>
        );
    }

    return (
        <>
            {/* Loading overlay for refresh operations */}
            {isLoading && movieDetails && (
                <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 items-center justify-center bg-black/60">
                    <View className="p-6 bg-alt-bg/80 rounded-lg items-center">
                        <ActivityIndicator size="large" color="#9810FA" />
                        <Text variant="h6" weight="bold" className="text-white mt-3">
                            Refreshing...
                        </Text>
                    </View>
                </View>
            )}

            <ScrollView
                className="flex-1 bg-dark-bg"
                showsVerticalScrollIndicator={false}
                scrollEnabled
            >
                {/* App Header */}
                <View className='flex flex-row justify-between items-center px-4 absolute w-full top-5 z-10'>
                    <TouchableOpacity
                        className='bg-alt-bg backdrop-blur-sm p-3 rounded-md'
                        onPress={handleBackPress}
                        activeOpacity={0.7}
                        style={Shadows.medium}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                    >
                        <Feather name='chevron-left' size={24} color={"#ffffff"} />
                    </TouchableOpacity>
                    
                    {/* Logo */}
                    <Image
                        source={movieDetails.network_logo ? { uri: movieDetails.network_logo } : DEFAULT_IMAGES.backdrop}
                        style={{ width: 100, height: 45 }}
                        contentFit='contain'
                        cachePolicy="memory-disk"
                        priority="high"
                    />
                    
                    <TouchableOpacity
                        className='bg-alt-bg backdrop-blur-sm p-3 rounded-md'
                        onPress={handleFavoritePress}
                        activeOpacity={0.7}
                        style={Shadows.medium}
                        accessibilityRole="button"
                        accessibilityLabel={movieDetails.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Ionicons 
                            name={movieDetails.is_favorite ? 'heart' : 'heart-outline'} 
                            size={24} 
                            color={movieDetails.is_favorite ? "#ef4444" : "#ffffff"} 
                        />
                    </TouchableOpacity>
                </View>

                {/* Movie Backdrop */}
                <View className='relative'>
                    <Image
                        source={movieDetails.backdrop_url ? { uri: movieDetails.backdrop_url } : DEFAULT_IMAGES.backdrop}
                        style={{
                            width: "100%",
                            height: screenWidth * 1.2,
                            alignSelf: 'center'
                        }}
                        contentPosition={"center"}
                        contentFit='cover'
                        cachePolicy="memory-disk"
                        priority="high"
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(11, 24, 38, 0.8)', CineMateColors.darkBg]}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '60%',
                        }}
                    />
                </View>

                {/* Movie Details */}
                <View className='px-4 -mt-40 relative z-10'>
                    <View className='flex-row justify-start items-center mb-6'>
                        <View className='mr-4'>
                            <Image
                                source={movieDetails.poster_url ? { uri: movieDetails.poster_url } : DEFAULT_IMAGES.poster}
                                style={{
                                    width: 120,
                                    height: 120 * (3 / 2),
                                    borderRadius: BorderRadius.md
                                }}
                                contentFit="cover"
                                cachePolicy="memory-disk"
                            />
                        </View>
                        
                        <View className='flex-1'>
                            <View>
                                <Text
                                    className='text-white px-6 py-2 bg-alt-bg/80 rounded-full border border-gray-600 self-start mb-3'
                                    variant='caption'
                                    weight='medium'
                                >
                                    {movieDetails.is_series ? "TV Series" : "Movie"}
                                </Text>
                            </View>
                            
                            <Text
                                variant='movieTitle'
                                weight='bold'
                                numberOfLines={3}
                                className='text-white mb-2'
                            >
                                {movieDetails.title || 'Unknown Title'}
                            </Text>
                            
                            <View className='flex-row items-center flex-wrap'>
                                <Text variant='small' weight='medium' className='text-gray-300'>
                                    {movieInfo.year}
                                </Text>
                                {movieDetails.language && (
                                    <>
                                        <Text className="text-gray-500 text-xs mx-2">•</Text>
                                        <Text variant='small' weight='medium' className='text-gray-300'>
                                            {movieDetails.language.toUpperCase()}
                                        </Text>
                                    </>
                                )}
                                {movieDetails.runtime && (
                                    <>
                                        <Text className="text-gray-500 text-xs mx-2">•</Text>
                                        <Text variant='small' weight='medium' className='text-gray-300'>
                                            {movieDetails.runtime} min
                                        </Text>
                                    </>
                                )}
                            </View>
                            
                            <View className='flex-row items-center mt-2'>
                                <Feather name="star" size={16} color="#fbbf24" />
                                <Text variant='small' weight='semiBold' className='text-yellow-400 ml-1'>
                                    {movieInfo.formattedRating}
                                </Text>
                                <Text className="text-gray-500 text-xs mx-2">•</Text>
                                <Text variant='small' weight='medium' className='text-gray-300'>
                                    TMDb
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Genre Tags */}
                {movieInfo.safeGenres.length > 0 && (
                    <View className='px-4 mb-6'>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            contentContainerStyle={{ paddingRight: Spacing.md }}
                        >
                            {movieInfo.safeGenres.map((genre, index) => (
                                <View
                                    key={`genre-${index}`}
                                    className='mr-3 px-5 py-2 bg-alt-bg/80 rounded-sm border border-gray-600'
                                    style={Shadows.small}
                                >
                                    <Text
                                        variant='caption'
                                        weight='medium'
                                        className='text-white'
                                    >
                                        {genre}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Synopsis */}
                <View className='px-4 mb-8'>
                    <Text
                        variant='h5'
                        weight='semiBold'
                        className='text-white mb-3'
                    >
                        Synopsis
                    </Text>
                    <Text
                        variant='small'
                        weight='medium'
                        style={{ lineHeight: 20, color: '#d1d5db', textAlign: 'justify' }}
                    >
                        {movieDetails.synopsis || "No synopsis available."}
                    </Text>
                </View>

                {/* Cast */}
                {movieInfo.safeCast.length > 0 && (
                    <View className='px-4 mb-8'>
                        <SectionHeader
                            title="Cast"
                            showButton={false}
                        />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: Spacing.md }}
                            decelerationRate="fast"
                            showsVerticalScrollIndicator={false}
                        >
                            {movieInfo.safeCast.map((cast) => (
                                <CastCard key={`cast-${cast.id}`} data={cast} />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Videos & Trailers */}
                {movieInfo.safeVideos.length > 0 && (
                    <View className='mb-8'>
                        <View className='px-4'>
                            <Text variant='h6' weight='semiBold' className='text-white mb-4'>
                                Videos & Trailers
                            </Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingRight: Spacing.md }}
                                decelerationRate="fast"
                                showsVerticalScrollIndicator={false}
                            >
                                {movieInfo.safeVideos.map((video) => (
                                    <VideoCard
                                        key={`video-${video.id}`}
                                        data={video}
                                        onPress={openVideo}
                                    />
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                )}

                {/* Episodes */}
                {movieDetails.is_series && movieInfo.safeSeasons.length > 0 && (
                    <View className='mb-8'>
                        <View className='px-4'>
                            {/* Season Selector */}
                            {movieInfo.safeSeasons.length > 1 && (
                                <View className='mb-6'>
                                    <Text variant='h6' weight='semiBold' className='text-white mb-3'>
                                        Select Season
                                    </Text>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingRight: Spacing.md }}
                                        decelerationRate="fast"
                                        showsVerticalScrollIndicator={false}
                                    >
                                        {movieInfo.safeSeasons.map((season) => (
                                            <TouchableOpacity
                                                key={`season-${season.id}`}
                                                onPress={() => handleSeasonChange(season.season_number || 1)}
                                                className={`mr-3 px-4 py-2 rounded-lg border ${selectedSeason === season.season_number
                                                    ? 'bg-primary border-primary'
                                                    : 'bg-alt-bg/80 border-gray-600'
                                                    }`}
                                                style={selectedSeason === season.season_number ? Shadows.small : {}}
                                                activeOpacity={0.8}
                                            >
                                                <Text
                                                    variant='caption'
                                                    weight='medium'
                                                    className={selectedSeason === season.season_number ? 'text-white' : 'text-gray-300'}
                                                >
                                                    {season.name || `Season ${season.season_number}`}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            {/* Episodes List */}
                            {filteredEpisodes.length > 0 && (
                                <View>
                                    <Text variant='h6' weight='semiBold' className='text-white mb-4'>
                                        Episodes ({filteredEpisodes.length})
                                    </Text>

                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingRight: Spacing.md }}
                                        decelerationRate="fast"
                                        showsVerticalScrollIndicator={false}
                                    >
                                        {filteredEpisodes.map((episode) => (
                                            <EpisodeCard key={`episode-${episode.id}`} data={episode} />
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Reviews */}
                {movieInfo.safeReviews.length > 0 && (
                    <View className='mb-8'>
                        <View className='px-4'>
                            <View className='flex-row items-center justify-between mb-4'>
                                <Text variant='h6' weight='semiBold' className='text-white'>
                                    Reviews ({movieInfo.safeReviews.length})
                                </Text>
                            </View>

                            {movieInfo.safeReviews.map((review) => (
                                <ReviewCard key={`review-${review.id}`} data={review} />
                            ))}
                        </View>
                    </View>
                )}

                {/* Video Player Modal */}
                <VideoPlayerModal
                    visible={isVideoModalVisible}
                    video={selectedVideo}
                    onClose={closeVideo}
                    onRequestClose={handleModalRequestClose}
                />
            </ScrollView>
        </>
    );
}

// Separated Modal Component
const VideoPlayerModal = memo(({ 
    visible, 
    video, 
    onClose, 
    onRequestClose 
}: {
    visible: boolean;
    video: VideoInfo | null;
    onClose: () => void;
    onRequestClose: () => void;
}) => (
    <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onRequestClose}
        transparent={false}
    >
        <View className="flex-1 bg-dark-bg">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
                <View className="flex-1">
                    <Text variant="h6" weight="semiBold" className="text-white" numberOfLines={1}>
                        {video?.title}
                    </Text>
                    <Text variant="caption" weight="medium" className="text-gray-400">
                        {video?.type} • {video?.views} views
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={onClose}
                    className="ml-4 p-2"
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Close video"
                >
                    <Feather name="x" size={24} color="#ffffff" />
                </TouchableOpacity>
            </View>

            {/* Video Player Container */}
            <View
                className="flex-1"
                style={{
                    pointerEvents: Platform.OS === 'web' ? 'box-none' : 'auto'
                }}
            >
                {video?.key && (
                    <EmbeddedVideoPlayer videoKey={String(video.key)} />
                )}
            </View>

            {/* Video Info */}
            <View className="p-4 border-t border-gray-700">
                <View className="flex-row items-center justify-between mb-2">
                    <Text variant="small" weight="semiBold" className="text-white flex-1" numberOfLines={2}>
                        {video?.title}
                    </Text>
                    {video?.official && (
                        <View className="ml-3 bg-primary px-2 py-1 rounded">
                            <Text variant="caption" weight="bold" className="text-white">
                                OFFICIAL
                            </Text>
                        </View>
                    )}
                </View>

                <View className="flex-row items-center flex-wrap">
                    <Text variant="caption" weight="medium" className="text-primary">
                        {video?.type}
                    </Text>
                    {video?.duration && (
                        <>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant="caption" weight="regular" className="text-gray-400">
                                {video.duration}
                            </Text>
                        </>
                    )}
                    {video?.views && (
                        <>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant="caption" weight="regular" className="text-gray-400">
                                {video.views} views
                            </Text>
                        </>
                    )}
                    {video?.published_at && (
                        <>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant="caption" weight="regular" className="text-gray-400">
                                {new Date(video.published_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </Text>
                        </>
                    )}
                </View>
            </View>
        </View>
    </Modal>
));
VideoPlayerModal.displayName = 'VideoPlayerModal';

// Cross-platform embedded video player component
const EmbeddedVideoPlayer = memo(({ videoKey }: { videoKey: string }) => {
    const embedUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1&modestbranding=1&rel=0&showinfo=0`;
    const [WebViewComponent, setWebViewComponent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(Platform.OS !== 'web');

    // Dynamic import for mobile platforms
    useEffect(() => {
        if (Platform.OS !== 'web') {
            import('react-native-webview')
                .then(({ WebView }) => {
                    setWebViewComponent(() => WebView);
                    setIsLoading(false);
                })
                .catch(() => {
                    console.warn('WebView not available');
                    setIsLoading(false);
                });
        }
    }, []);

    if (Platform.OS === 'web') {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    pointerEvents: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
            >
                <iframe
                    src={embedUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        pointerEvents: 'auto'
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-800">
                <ActivityIndicator size="large" color="#9810FA" />
                <Text variant="small" weight="medium" className="text-white text-center px-4 mt-3">
                    Loading video player...
                </Text>
            </View>
        );
    }

    if (WebViewComponent) {
        return (
            <WebViewComponent
                source={{ uri: embedUrl }}
                style={{ flex: 1 }}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
                allowsFullscreenVideo={true}
                mixedContentMode="compatibility"
                userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
                onLoadStart={() => console.log('WebView loading started')}
                onLoadEnd={() => console.log('WebView loading ended')}
                onError={(syntheticEvent: any) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent);
                }}
                renderLoading={() => (
                    <View className="flex-1 items-center justify-center bg-gray-800">
                        <ActivityIndicator size="large" color="#9810FA" />
                    </View>
                )}
            />
        );
    }

    return (
        <View className="flex-1 items-center justify-center bg-gray-800">
            <Feather name="video-off" size={48} color="#6b7280" />
            <Text variant="small" weight="medium" className="text-white text-center px-4 mt-3">
                Video player unavailable
            </Text>
        </View>
    );
});
EmbeddedVideoPlayer.displayName = 'EmbeddedVideoPlayer';

const CastCard = memo(({ data }: { data: CastInfo }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            className='mr-2 items-center'
            style={{ width: CARD_WIDTHS.CAST }}
            accessibilityRole="button"
            accessibilityLabel={`View ${data.name || 'cast member'} details`}
        >
            <Image
                source={data.profile_path ? { uri: data.profile_path } : DEFAULT_IMAGES.profile}
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: BorderRadius.md,
                    marginBottom: Spacing.xs
                }}
                placeholder={DEFAULT_IMAGES.profile}
                contentPosition={"top center"}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
            />
            <Text
                variant='caption'
                weight='semiBold'
                className='text-white text-center mb-1'
                numberOfLines={1}
            >
                {data.name || 'Unknown'}
            </Text>
            <Text
                variant='caption'
                weight='regular'
                className='text-center text-gray-400'
                numberOfLines={2}
            >
                {data.character || 'Character'}
            </Text>
        </TouchableOpacity>
    );
});
CastCard.displayName = 'CastCard';

const EpisodeCard = memo(({ data }: { data: EpisodeInfo }) => {
    const formattedDate = useMemo(() => {
        if (!data.air_date) return 'TBA';
        try {
            return new Date(data.air_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    }, [data.air_date]);

    const formattedRating = useMemo(() => {
        return data.vote_average ? Number(data.vote_average).toFixed(1) : 'N/A';
    }, [data.vote_average]);

    return (
        <TouchableOpacity
            className='mr-4 bg-alt-bg/40 rounded-lg overflow-hidden'
            style={[{ width: CARD_WIDTHS.EPISODE }, Shadows.small]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Episode ${data.episode_number}: ${data.name || 'Untitled'}`}
        >
            {/* Episode Thumbnail */}
            <View className='relative'>
                <Image
                    source={data.still_path ? { uri: data.still_path } : DEFAULT_IMAGES.poster}
                    style={{
                        width: '100%',
                        height: 120,
                        backgroundColor: CineMateColors.altBg
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                />

                {/* Episode Number Badge */}
                <View className='absolute top-2 left-2 bg-black/70 px-2 py-1 rounded'>
                    <Text variant='caption' weight='bold' className='text-white'>
                        E{data.episode_number || '?'}
                    </Text>
                </View>

                {/* Rating Badge */}
                {data.vote_average && (
                    <View className='absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex-row items-center'>
                        <Feather name="star" size={10} color="#fbbf24" />
                        <Text variant='caption' weight='medium' className='text-white ml-1'>
                            {formattedRating}
                        </Text>
                    </View>
                )}

                {/* Duration Badge */}
                {data.runtime && (
                    <View className='absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded'>
                        <Text variant='caption' weight='medium' className='text-white'>
                            {data.runtime}m
                        </Text>
                    </View>
                )}
            </View>

            {/* Episode Details */}
            <View className='p-3'>
                <Text variant='small' weight='semiBold' className='text-white mb-1' numberOfLines={2}>
                    {data.name || 'Untitled Episode'}
                </Text>

                <Text variant='caption' weight='medium' className='text-gray-400 mb-2'>
                    {formattedDate}
                </Text>

                <Text
                    variant='caption'
                    weight='regular'
                    className='text-gray-300'
                    style={{ lineHeight: 14 }}
                    numberOfLines={5}
                >
                    {data.overview || 'No description available.'}
                </Text>
            </View>
        </TouchableOpacity>
    );
});
EpisodeCard.displayName = 'EpisodeCard';

const ReviewCard = memo(({ data }: { data: ReviewInfo }) => {
    const formattedDate = useMemo(() => {
        if (!data.created_at) return 'Unknown date';
        try {
            return new Date(data.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    }, [data.created_at]);

    return (
        <View
            key={data.id}
            className='bg-alt-bg/40 rounded-lg p-4 mb-4'
            style={Shadows.small}
        >
            <View className='flex-row items-center mb-3'>
                <Image
                    source={data.avatar ? { uri: data.avatar } : DEFAULT_IMAGES.profile}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: CineMateColors.altBg
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                />
                <View className='flex-1 ml-3'>
                    <Text variant='small' weight='semiBold' className='text-white'>
                        {data.author || 'Anonymous'}
                    </Text>
                    <View className='flex-row items-center'>
                        <StarRating
                            rating={data.rating || 0}
                            maxRating={5}
                            starSize={12}
                            starColor="#fbbf24"
                            emptyStarColor="#6b7280"
                            labelConfig={{
                                show: false
                            }}
                        />
                        <Text variant='caption' weight='regular' className='ml-2 text-gray-400'>
                            {formattedDate}
                        </Text>
                    </View>
                </View>
            </View>
            <Text 
                variant='small' 
                weight='regular' 
                className='text-gray-300' 
                numberOfLines={10} 
                style={{ lineHeight: 18 }}
            >
                {data.content || 'No review content available.'}
            </Text>
        </View>
    );
});
ReviewCard.displayName = 'ReviewCard';

const VideoCard = memo(({ data, onPress }: { data: VideoInfo; onPress: (video: VideoInfo) => void }) => {
    const formattedDate = useMemo(() => {
        if (!data.published_at) return 'Unknown date';
        try {
            return new Date(data.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    }, [data.published_at]);

    const handlePress = useCallback(() => {
        onPress(data);
    }, [data, onPress]);

    return (
        <TouchableOpacity
            key={data.id}
            className='mr-4 bg-alt-bg/40 rounded-lg overflow-hidden'
            style={[{ width: CARD_WIDTHS.VIDEO }, Shadows.small]}
            activeOpacity={0.8}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={`Play video: ${data.title || 'Untitled'}`}
        >
            <View className='relative'>
                <Image
                    source={data.thumbnail ? { uri: data.thumbnail } : DEFAULT_IMAGES.poster}
                    style={{
                        width: '100%',
                        height: 120,
                        backgroundColor: CineMateColors.altBg
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                />

                {/* Play Button Overlay */}
                <View className='absolute inset-0 items-center justify-center bg-black/30'>
                    <View className='bg-primary rounded-full p-3'>
                        <Feather name="play" size={24} color="white" />
                    </View>
                </View>

                {/* Official Badge */}
                {data.official && (
                    <View className='absolute top-2 left-2 bg-primary px-2 py-1 rounded'>
                        <Text variant='caption' weight='bold' className='text-white'>
                            OFFICIAL
                        </Text>
                    </View>
                )}

                {/* Duration Badge */}
                {data.duration && (
                    <View className='absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded'>
                        <Text variant='caption' weight='medium' className='text-white'>
                            {data.duration}
                        </Text>
                    </View>
                )}
            </View>

            <View className='p-3'>
                <Text variant='small' weight='semiBold' className='text-white mb-1' numberOfLines={2}>
                    {data.title || 'Untitled Video'}
                </Text>
                <View className='flex-row items-center justify-between mb-1'>
                    <Text variant='caption' weight='medium' className='text-primary'>
                        {data.type || 'Video'}
                    </Text>
                    {data.views && (
                        <Text variant='caption' weight='regular' className='text-gray-400'>
                            {data.views} views
                        </Text>
                    )}
                </View>
                <Text variant='caption' weight='regular' className='text-gray-500'>
                    {formattedDate}
                </Text>
            </View>
        </TouchableOpacity>
    );
});
VideoCard.displayName = 'VideoCard';