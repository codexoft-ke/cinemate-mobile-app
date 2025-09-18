import { Text } from '@/components/ui/app-text';
import SectionHeader from '@/components/ui/section-header';
import { BorderRadius, CineMateColors, Shadows, Spacing } from '@/constants/theme';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get("window");

interface CastCardProps {
    id: number;
    name: string;
    profile_path: string;
    character: string;
}

interface EpisodesTabProps {
    series_id: number | string;
    seasons: {
        id: number;
        name: string;
        [key: string]: any;
    }[];
}

export default function MovieInfo() {

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [movieDetails, setMovieDetails] = useState({
        id: 291256,
        isSeries: true,
        isFavorite: false,
        title: "Sara - Woman in the Shadows",
        language: "Italian",
        release_date: "2025-06-03",
        rating: 6.4,
        backdrop_url: "https://image.tmdb.org/t/p/w1280/cBsAo9icWr0mZBvd4Rc0R4kxnDU.jpg",
        poster_url: "https://image.tmdb.org/t/p/w500/9QVSjcrWGjV46DlSLfh9JI4oIaa.jpg",
        genre: ["Mystery", "Drama", "Crime"],
        overview: "The suspicious death of her son pushes a former secret agent back into action, investigating a series of crimes that grows increasingly sinister.",
        homepage: "https://www.netflix.com/title/81515638",
        seasons: [
            {
                id: 455992,
                air_date: "2025-06-03",
                episode_count: 6,
                name: "Season 1",
                overview: "",
                poster_path: "https://image.tmdb.org/t/p/w500/9QVSjcrWGjV46DlSLfh9JI4oIaa.jpg",
                season_number: 1,
                vote_average: 7
            }
        ],
        cast: [
            {
                id: 116532,
                name: "Teresa Saponangelo",
                profile_path: "https://image.tmdb.org/t/p/w500/bX7qS1ighwuT7GuUxig4c9vcuFy.jpg",
                character: "Sara",
                order: 0
            },
            {
                id: 8776,
                name: "Claudia Gerini",
                profile_path: "https://image.tmdb.org/t/p/w500/QFBen9LPrKuSr9awe0Go3gl6sG.jpg",
                character: "Teresa",
                order: 1
            },
            {
                id: 1794066,
                name: "Flavio Furno",
                profile_path: "https://image.tmdb.org/t/p/w500/qzvs3sdEmgZ0VoLgYBCwhGUDxPd.jpg",
                character: "Pardo",
                order: 2
            },
            {
                id: 3185219,
                name: "Chiara Celotto",
                profile_path: "https://image.tmdb.org/t/p/w500/voK0f2ZySelLco8PCERrVGIE7VI.jpg",
                character: "Viola",
                order: 3
            },
            {
                id: 131632,
                name: "Massimo Popolizio",
                profile_path: "https://image.tmdb.org/t/p/w500/4k0rslj9VtRUpr5APdPXQyeAIkH.jpg",
                character: "Corrado Lembo",
                order: 4
            },
            {
                id: 125696,
                name: "Antonio Gerardi",
                profile_path: "https://image.tmdb.org/t/p/w500/7OI80SQpWPOsfZQR43l6HyU2tn4.jpg",
                character: "Tarallo",
                order: 5
            },
            {
                id: 90324,
                name: "Carmine Recano",
                profile_path: "https://image.tmdb.org/t/p/w500/uNSjwRmaEyD21IZJ58XeR4D0yq0.jpg",
                character: "Massimiliano",
                order: 6
            },
            {
                id: 3724013,
                name: "Giacomo Giorgio",
                profile_path: "https://image.tmdb.org/t/p/w500/jCxEDD4UWhSVfjB7ARIvfnvZPHw.jpg",
                character: "Attilio Musella",
                order: 7
            },
            {
                id: 2182063,
                name: "Haroun Fall",
                profile_path: "https://image.tmdb.org/t/p/w500/lJfFPqaST9KzPI8BAxYe232NcWg.jpg",
                character: "",
                order: 8
            }
        ]
    });

    const tabScrollRef = useRef<ScrollView>(null);

    const tabs = [
        { key: 'episodes', label: 'Episodes', icon: 'tv' },
        { key: 'reviews', label: 'Reviews', icon: 'star' },
        { key: 'videos', label: 'Videos', icon: 'play-circle' }
    ];

    return (
        <ScrollView
            className="flex-1 bg-dark-bg"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            scrollEnabled
        >

            {/* App Header */}
            <View className='flex flex-row justify-between items-center px-4 absolute w-full top-5 z-10'>
                <TouchableOpacity
                    className='bg-alt-bg backdrop-blur-sm p-3 rounded-md'
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                    style={Shadows.medium}
                >
                    <Feather name='chevron-left' size={24} color={"#ffffff"} />
                </TouchableOpacity>
                {/* Logo */}
                <Image
                    source={require('@/assets/images/logos/amazon-prime.png')}
                    style={{ width: 100, height: 45 }}
                    contentFit='contain'
                />
                <TouchableOpacity
                    className='bg-alt-bg backdrop-blur-sm p-3 rounded-md'
                    activeOpacity={0.7}
                    style={Shadows.medium}
                >
                    <Ionicons name='heart-outline' size={24} color={"#ffffff"} />
                </TouchableOpacity>
            </View>

            {/* Movie Backdrop */}
            <View className='relative'>
                <Image
                    source={require("@/assets/images/user.jpeg")}
                    style={{
                        width: "100%",
                        height: screenWidth * 1.2,
                        alignSelf: 'center'
                    }}
                    contentPosition={"center"}
                    contentFit='cover'
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
                            source={require("@/assets/images/user.jpeg")}
                            style={{
                                width: 120,
                                height: 120 * (3 / 2),
                                borderRadius: BorderRadius.md
                            }}
                            contentFit="cover"
                        />
                    </View>
                    <View className='flex-1'>
                        <View>
                            <Text
                                className='text-white px-6 py-2 bg-alt-bg/80 rounded-full border border-gray-600 self-start mb-3'
                                variant='caption'
                                weight='medium'
                            >
                                Series
                            </Text>
                        </View>
                        <Text
                            variant='movieTitle'
                            weight='bold'
                            numberOfLines={3}
                            className='text-white mb-2'
                        >
                            Sara - Woman in the Shadow
                        </Text>
                        <View className='flex-row items-center flex-wrap'>
                            <Text variant='small' weight='medium' className='text-gray-300'>2025</Text>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant='small' weight='medium' className='text-gray-300'>Italian</Text>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant='small' weight='medium' className='text-gray-300'>68 min</Text>
                        </View>
                        <View className='flex-row items-center mt-2'>
                            <Feather name="star" size={16} color="#fbbf24" />
                            <Text variant='small' weight='semiBold' className='text-yellow-400 ml-1'>8.5</Text>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant='small' weight='medium' className='text-gray-300'>TMDb</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Genre Tags */}
            <View className='px-4 mb-6'>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ paddingRight: Spacing.md }}
                >
                    {["Thriller", "Drama", "Sci-Fi", "Animation"].map((genre, index) => (
                        <View
                            key={index}
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
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Exercitationem, corrupti. Distinctio fuga exercitationem voluptatem voluptate expedita at quisquam ea cupiditate libero non, nostrum consectetur repellendus quasi similique cumque in atque. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, voluptatum.
                </Text>
            </View>

            {/* Cast */}
            {movieDetails.cast.length > 0 && (
                <View className='px-4 mb-8'>
                    <SectionHeader
                        title="Cast"
                        showButton={false}
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: Spacing.md }}
                    >
                        {movieDetails.cast.map((cast, index) => (
                            <CastCard key={index} {...cast} />
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Tabs - Seasons, Reviews, Videos */}
            <View className='px-4 mb-8'>
                {/* Tab Headers */}
                <View className='flex-row justify-around mb-6 bg-alt-bg/40 rounded-lg p-1'>
                    {tabs.map((tab, index) => (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => {
                                setActiveTabIndex(index);
                                tabScrollRef.current?.scrollTo({ 
                                    x: index * screenWidth, 
                                    animated: true 
                                });
                            }}
                            className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-md ${activeTabIndex === index ? 'bg-primary' : 'bg-transparent'
                                }`}
                            activeOpacity={0.8}
                            style={activeTabIndex === index ? Shadows.small : {}}
                        >
                            <Feather
                                name={tab.icon as any}
                                size={16}
                                color={activeTabIndex === index ? '#ffffff' : '#9ca3af'}
                            />
                            <Text
                                variant='caption'
                                weight='medium'
                                className={`ml-2 ${activeTabIndex === index ? 'text-white' : 'text-gray-400'
                                    }`}
                            >
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Swipeable Tab Content with ScrollView */}
                <ScrollView
                    ref={tabScrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                        if (newIndex >= 0 && newIndex < tabs.length) {
                            setActiveTabIndex(newIndex);
                        }
                    }}
                    style={{
                        height: 500,
                        borderRadius: BorderRadius.md,
                        overflow: 'hidden'
                    }}
                    contentContainerStyle={{ flexDirection: 'row' }}
                >
                    {/* Episodes Tab Content */}
                    <View style={{ width: screenWidth - 32 }} className='bg-transparent px-4'>
                        <EpisodesTab series_id={movieDetails.id} seasons={movieDetails.seasons} />
                    </View>

                    {/* Reviews Tab Content */}
                    <View style={{ width: screenWidth - 32 }} className='bg-transparent px-4'>
                        <ReviewsTab />
                    </View>

                    {/* Videos Tab Content */}
                    <View style={{ width: screenWidth - 32 }} className='bg-transparent px-4'>
                        <VideosTab />
                    </View>
                </ScrollView>
            </View>

        </ScrollView>
    );
}

const CastCard = ({ id, name, profile_path, character }: CastCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            className='mr-2 items-center'
            style={{ width: 100 }}
        >
            <Image
                source={profile_path ? { uri: profile_path } : require("@/assets/images/icon.png")}
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: BorderRadius.md,
                    marginBottom: Spacing.xs
                }}
                placeholder={require("@/assets/images/icon.png")}
                contentPosition={"top center"}
                contentFit="cover"
            />
            <Text
                variant='caption'
                weight='semiBold'
                className='text-white text-center mb-1'
                numberOfLines={1}
            >
                {name}
            </Text>
            <Text
                variant='caption'
                weight='regular'
                className='text-center text-gray-400'
                numberOfLines={2}
            >
                {character}
            </Text>
        </TouchableOpacity>
    )
}

const EpisodesTab = ({ seasons }: EpisodesTabProps) => {

    interface Episode {
        id: string | number
        name: string
        overview: string
        air_date: string
        episode_number: string | number
        runtime: string | number
        season_number: string | number
        still_path: string
        vote_average: string | number
    }

    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [episodes, setEpisodes] = useState<Episode[]>([
        {
            id: 6225573,
            name: "Episode 1",
            overview: "After the suspicious death of her estranged son Giorgio, ex-secret agent Sara reconnects with her former team and the life she left behind years earlier.",
            air_date: "2025-06-03",
            episode_number: 1,
            runtime: 58,
            season_number: 1,
            still_path: "https://image.tmdb.org/t/p/w500/7fQdb4N8v9AocqlLsvwKlQNOUXr.jpg",
            vote_average: 7
        },
        {
            id: 6225576,
            name: "Episode 2",
            overview: "Teresa pushes Sara to follow Sergio's last steps and solve his disappearance. Pardo rivals the former secret agent and doesn't trust her.",
            air_date: "2025-06-03",
            episode_number: 2,
            runtime: 53,
            season_number: 1,
            still_path: "https://image.tmdb.org/t/p/w500/743AqLm8mif2wu55U3XusJKMxoh.jpg",
            vote_average: 7
        },
        {
            id: 6225577,
            name: "Episode 3",
            overview: "An illegal farm worker claims responsibility for a double murder, but Sara and Pardo suspect something's off — especially when a politician intervenes.",
            air_date: "2025-06-03",
            episode_number: 3,
            runtime: 52,
            season_number: 1,
            still_path: "https://image.tmdb.org/t/p/w500/c2bmTGdMzVBTLRO0AS3zxocJfUw.jpg",
            vote_average: 8
        },
        {
            id: 6225578,
            name: "Episode 4",
            overview: "Sara and Pardo pursue a determined but elusive journalist. Teresa confronts lies from her last lover while worrying about the future of the unit.",
            air_date: "2025-06-03",
            episode_number: 4,
            runtime: 51,
            season_number: 1,
            still_path: "https://image.tmdb.org/t/p/w500/hLA9a4MaiGtt2NBNl8CX1hlhO6Z.jpg",
            vote_average: 7
        },
        {
            id: 6227999,
            name: "Episode 5",
            overview: "A new disappearance sets Sara in motion. A face from the past gives her the chance to settle some old scores, but she's unwilling to risk Viola's safety.",
            air_date: "2025-06-03",
            episode_number: 5,
            runtime: 49,
            season_number: 1,
            still_path: "https://image.tmdb.org/t/p/w500/tbnalbUUC30CLPmjr48jDPM1BWB.jpg",
            vote_average: 6
        },
        {
            id: 6228000,
            name: "Episode 6",
            overview: "The election campaign is nearing its end. While tracking a friend of Tarallo, Sara and Pardo uncover something bigger than expected.",
            air_date: "2025-06-03",
            episode_number: 6,
            runtime: 58,
            season_number: 1,
            still_path: "https://image.tmdb.org/t/p/w500/7GPpHtBUqLA7wYXImaRJtVNHSGM.jpg",
            vote_average: 7
        }
    ]);

    // Filter episodes based on selected season
    const filteredEpisodes = episodes.filter(episode =>
        episode.season_number === selectedSeason
    );

    return (
        <View className='flex-1'>
            {/* Season Selector */}
            {seasons.length > 1 && (
                <View className='mb-6'>
                    <Text variant='h6' weight='semiBold' className='text-white mb-3'>
                        Select Season
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: Spacing.md }}
                    >
                        {seasons.map((season, index) => (
                            <TouchableOpacity
                                key={season.id}
                                onPress={() => setSelectedSeason(season.season_number)}
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
                                    {season.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Episodes List */}
            <View className='flex-1'>
                <Text variant='h6' weight='semiBold' className='text-white mb-4'>
                    Episodes ({filteredEpisodes.length})
                </Text>

                <View>
                    {filteredEpisodes.map((episode, index) => (
                        <TouchableOpacity
                            key={index}
                            className='flex-row bg-alt-bg/40 rounded-lg  mb-3'
                            style={Shadows.small}
                            activeOpacity={0.8}
                        >
                            {/* Episode Thumbnail */}
                            <View className='mr-4 relative'>
                                <Image
                                    source={episode.still_path ? { uri: episode.still_path } : require("@/assets/images/user.jpeg")}
                                    style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: BorderRadius.sm,
                                        backgroundColor: CineMateColors.altBg
                                    }}
                                    contentFit="cover"
                                    placeholder="https://via.placeholder.com/120x120/192C40/666666?text=Episode"
                                />


                                {/* Episode Number Badge */}
                                <View className='absolute top-2 left-2 bg-black/70 px-2 py-1 rounded'>
                                    <Text variant='caption' weight='bold' className='text-white'>
                                        {episode.episode_number}
                                    </Text>
                                </View>
                            </View>

                            {/* Episode Details */}
                            <View className='flex-1'>
                                <View className='flex-row items-center justify-between mb-2'>
                                    <Text variant='body' weight='semiBold' className='text-white flex-1' numberOfLines={1}>
                                        {episode.name}
                                    </Text>
                                </View>

                                <View className='flex-row items-center mb-2'>
                                    <Text variant='caption' weight='medium' className='text-gray-400'>
                                        {new Date(episode.air_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </Text>
                                    <Text className="text-gray-500 text-xs mx-2">•</Text>
                                    <Text variant='caption' weight='medium' className='text-gray-400'>
                                        {episode.runtime} min
                                    </Text>
                                    <Text className="text-gray-500 text-xs mx-2">•</Text>
                                    <Feather name="star" size={16} color="#fbbf24" />
                                    <Text variant='small' weight='semiBold' className='text-yellow-400 ml-1'>8.5</Text>
                                </View>

                                <Text
                                    variant='small'
                                    weight='regular'
                                    className='text-gray-300 leading-4'
                                    numberOfLines={3}
                                >
                                    {episode.overview}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const ReviewsTab = () => {
    const reviews = [
        {
            id: 1,
            author: "John Smith",
            rating: 4.5,
            date: "Dec 15, 2024",
            content: "Amazing series! The cinematography is stunning and the story keeps you engaged throughout. Highly recommend watching this.",
            avatar: ""
        },
        {
            id: 2,
            author: "Sarah Johnson",
            rating: 4.0,
            date: "Dec 10, 2024",
            content: "Great acting and plot development. Some episodes are better than others, but overall a solid watch.",
            avatar: ""
        },
        {
            id: 3,
            author: "Mike Chen",
            rating: 5.0,
            date: "Dec 5, 2024",
            content: "Absolutely brilliant! One of the best series I've watched this year. The character development is exceptional.",
            avatar: ""
        },
    ];

    return (
        <View>
            <View className='flex-row items-center justify-between mb-4'>
                <Text variant='h6' weight='semiBold' className='text-white'>
                    Reviews ({reviews.length})
                </Text>
            </View>

            {reviews.map((review) => (
                <View
                    key={review.id}
                    className='bg-alt-bg/40 rounded-lg p-4 mb-3'
                    style={Shadows.small}
                >
                    <View className='flex-row items-center mb-3'>
                        <Image
                            source={require("@/assets/images/user.jpeg")}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: CineMateColors.altBg
                            }}
                            contentFit="cover"
                        />
                        <View className='flex-1 ml-3'>
                            <Text variant='small' weight='semiBold' className='text-white'>
                                {review.author}
                            </Text>
                            <View className='flex-row items-center'>
                                <View className='flex-row items-center mr-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Feather
                                            key={star}
                                            name="star"
                                            size={12}
                                            color={star <= review.rating ? "#fbbf24" : "#6b7280"}
                                        />
                                    ))}
                                </View>
                                <Text variant='caption' weight='regular' className='text-gray-400'>
                                    {review.date}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text variant='small' weight='regular' className='text-gray-300 leading-5'>
                        {review.content}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const VideosTab = () => {
    const videos = [
        {
            id: 1,
            title: "Official Trailer",
            duration: "2:34",
            type: "Trailer",
            thumbnail: "",
            views: "1.2M"
        },
        {
            id: 2,
            title: "Behind the Scenes",
            duration: "5:18",
            type: "Featurette",
            thumbnail: "",
            views: "456K"
        },
        {
            id: 3,
            title: "Cast Interviews",
            duration: "8:45",
            type: "Interview",
            thumbnail: "",
            views: "789K"
        },
        {
            id: 4,
            title: "Making of Season 1",
            duration: "12:30",
            type: "Documentary",
            thumbnail: "",
            views: "234K"
        },
    ];

    return (
        <View>
            <Text variant='h6' weight='semiBold' className='text-white mb-4'>
                Videos & Trailers
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: Spacing.md }}
            >
                {videos.map((video) => (
                    <TouchableOpacity
                        key={video.id}
                        className='mr-4 bg-alt-bg/40 rounded-lg overflow-hidden'
                        style={[{ width: 200 }, Shadows.small]}
                        activeOpacity={0.8}
                    >
                        <View className='relative'>
                            <Image
                                source={require("@/assets/images/user.jpeg")}
                                style={{
                                    width: '100%',
                                    height: 120,
                                    backgroundColor: CineMateColors.altBg
                                }}
                                contentFit="cover"
                            />

                            {/* Play Button Overlay */}
                            <View className='absolute inset-0 items-center justify-center bg-black/30'>
                                <View className='bg-primary rounded-full p-3'>
                                    <Feather name="play" size={24} color="white" />
                                </View>
                            </View>

                            {/* Duration Badge */}
                            <View className='absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded'>
                                <Text variant='caption' weight='medium' className='text-white'>
                                    {video.duration}
                                </Text>
                            </View>
                        </View>

                        <View className='p-3'>
                            <Text variant='small' weight='semiBold' className='text-white mb-1' numberOfLines={2}>
                                {video.title}
                            </Text>
                            <View className='flex-row items-center justify-between'>
                                <Text variant='caption' weight='medium' className='text-primary'>
                                    {video.type}
                                </Text>
                                <Text variant='caption' weight='regular' className='text-gray-400'>
                                    {video.views} views
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
