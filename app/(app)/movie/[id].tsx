import { Text } from '@/components/ui/app-text';
import SectionHeader from '@/components/ui/section-header';
import StarRating from '@/components/ui/star-rating';
import { BorderRadius, CineMateColors, Shadows, Spacing } from '@/constants/theme';
import { CastInfo, EpisodeInfo, ReviewInfo, VideoInfo } from '@/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { Dimensions, Modal, Platform, ScrollView, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get("window");

export default function MovieInfo() {

    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [isVideoModalVisible, setIsVideoModalVisible] = useState<boolean>(false);
    const [selectedVideo, setSelectedVideo] = useState<VideoInfo | null>(null);

    const [movieDetails] = useState({
        id: 119051,
        isSeries: true,
        isFavorite: false,
        title: "Wednesday",
        language: "English",
        release_date: "2022-11-23",
        rating: 8.392,
        runtime: null,
        network_logo: "https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png",
        backdrop_url: "https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
        poster_url: "https://image.tmdb.org/t/p/w500/36xXlhEpQqVVPuiZhfoQuaY4OlA.jpg",
        genre: ["Sci-Fi & Fantasy", "Mystery", "Comedy"],
        synopsis: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates twisted mysteries while making new friends — and foes — at Nevermore Academy.",
        homepage: "https://www.netflix.com/title/81231974",
        seasons: [
            {
                id: 182137,
                air_date: "2022-11-23",
                episode_count: 8,
                name: "Season 1",
                overview: "",
                poster_path: "https://image.tmdb.org/t/p/w500/v9fNsN3WNXObKJjBWkiKMuT3XoR.jpg",
                season_number: 1,
                vote_average: 8.5
            },
            {
                id: 345672,
                air_date: "2025-08-06",
                episode_count: 8,
                name: "Season 2",
                overview: "",
                poster_path: "https://image.tmdb.org/t/p/w500/aamw6JjKwTy6bdviyIcFKekSD6x.jpg",
                season_number: 2,
                vote_average: 7.6
            }
        ],
        cast: [
            {
                id: 974169,
                name: "Jenna Ortega",
                profile_path: "https://image.tmdb.org/t/p/w128_and_h128_face/cV4x7jNmsGLdKZn5I6xVF3Ltnmg.jpg",
                character: "Wednesday Addams",
                order: 1
            },
            {
                id: 884,
                name: "Steve Buscemi",
                profile_path: "https://image.tmdb.org/t/p/w128_and_h128_face/lQKdHMxfYcCBOvwRKBAxPZVNtkg.jpg",
                character: "Barry Dort",
                order: 3
            },
            {
                id: 1911865,
                name: "Hunter Doohan",
                profile_path: "https://image.tmdb.org/t/p/w128_and_h128_face/ihno5ut6ha8TaubQFgl5Ozco2K1.jpg",
                character: "Tyler Galpin",
                order: 5
            },
            {
                id: 2604515,
                name: "Emma Myers",
                profile_path: "https://image.tmdb.org/t/p/w128_and_h128_face/v1Y8RP39135ZOary9M4MbkrCAdn.jpg",
                character: "Enid Sinclair",
                order: 6
            },
            {
                id: 2189049,
                name: "Joy Sunday",
                profile_path: "https://image.tmdb.org/t/p/w128_and_h128_face/phPn3BRW1vZzxkl3hgEy8umzXn.jpg",
                character: "Bianca Barclay",
                order: 8
            },
            {
                id: 2488176,
                name: "Isaac Ordonez",
                profile_path: "https://image.tmdb.org/t/p/w128_and_h128_face/zSNeeC0lKZXvdFWCphVAvMLW4fR.jpg",
                character: "Pugsley Addams",
                order: 10
            },
            {
                id: 3235624,
                name: "Moosa Mostafa",
                profile_path: "https://image.tmdb.org/t/p/w128_and_h128_face/wikQ8RVQ5NRpfLDRwI4MwO96o1r.jpg",
                character: "Eugene Ottinger",
                order: 11
            },
            {
                id: 40481,
                name: "Luis Guzmán",
                profile_path: "https://image.tmdb.org/t/p/w128_and_h128_face/kSdxUckOJj9R5VKrLUnRy14YhNV.jpg",
                character: "Gomez Addams",
                order: 21
            },
            {
                id: 1922,
                name: "Catherine Zeta-Jones",
                profile_path: "https://image.tmdb.org/t/p/w128_and_h128_face/9VE0zNIs11aD9BHCKiGAZEIE5c8.jpg",
                character: "Morticia Addams",
                order: 22
            }
        ]
    });


    const videos = [
        {
            "id": "63a90d10a6a4c1008097912d",
            "title": "The Cast of Wednesday Describes The Show In 15 Seconds",
            "thumbnail": "https://i.ytimg.com/vi/oqM983a0GzA/hqdefault.jpg",
            "duration": "0:15",
            "views": "1.2M",
            "key": "oqM983a0GzA",
            "type": "Featurette",
            "official": true,
            "published_at": "2022-11-23T14:00:00.000Z"
        },
        {
            "id": "636c5c0b81383100772f2d14",
            "title": "Welcome to Nevermore",
            "thumbnail": "https://i.ytimg.com/vi/N1OKeHFX0PQ/hqdefault.jpg",
            "duration": "2:31",
            "views": "3.8M",
            "key": "N1OKeHFX0PQ",
            "type": "Behind the Scenes",
            "official": true,
            "published_at": "2022-11-09T18:00:00.000Z"
        },
        {
            "id": "636abdc8d363e50090a91716",
            "title": "Title Sequence",
            "thumbnail": "https://i.ytimg.com/vi/2LaCvjjNgR4/hqdefault.jpg",
            "duration": "1:47",
            "views": "2.1M",
            "key": "2LaCvjjNgR4",
            "type": "Opening Credits",
            "official": true,
            "published_at": "2022-11-08T20:00:00.000Z"
        },
        {
            "id": "635101ffc99826007ddc0dd4",
            "title": "From the Mind of Tim Burton",
            "thumbnail": "https://i.ytimg.com/vi/XszaIFktCVw/hqdefault.jpg",
            "duration": "1:23",
            "views": "1.9M",
            "key": "XszaIFktCVw",
            "type": "Behind the Scenes",
            "official": true,
            "published_at": "2022-10-19T16:30:00.000Z"
        },
        {
            "id": "63efd6ee5249780084f59e1c",
            "title": "New York Comic-Con Trailer",
            "thumbnail": "https://i.ytimg.com/vi/Qa5kFRxBkNw/hqdefault.jpg",
            "duration": "2:18",
            "views": "856K",
            "key": "Qa5kFRxBkNw",
            "type": "Trailer",
            "official": false,
            "published_at": "2022-10-09T13:00:16.000Z"
        },
        {
            "id": "632f44c7dd4716008e41cf0a",
            "title": "Wednesday Addams vs. Thing",
            "thumbnail": "https://i.ytimg.com/vi/RCL_dp8YRtA/hqdefault.jpg",
            "duration": "1:05",
            "views": "4.2M",
            "key": "RCL_dp8YRtA",
            "type": "Clip",
            "official": true,
            "published_at": "2022-09-24T17:29:00.000Z"
        },
        {
            "id": "63a90e6faaec710086783368",
            "title": "Join Wednesday's Addams' New Home - Nevermore Academy",
            "thumbnail": "https://i.ytimg.com/vi/SoTmSuThMKc/hqdefault.jpg",
            "duration": "0:32",
            "views": "3.5M",
            "key": "SoTmSuThMKc",
            "type": "Teaser",
            "official": true,
            "published_at": "2022-09-21T16:30:00.000Z"
        },
        {
            "id": "630694f918864b007b185f3b",
            "title": "Inside the Character",
            "thumbnail": "https://i.ytimg.com/vi/6AWlVOMWt10/hqdefault.jpg",
            "duration": "1:41",
            "views": "2.7M",
            "key": "6AWlVOMWt10",
            "type": "Behind the Scenes",
            "official": true,
            "published_at": "2022-08-24T19:00:00.000Z"
        },
        {
            "id": "62fd0336435abd0091571d26",
            "title": "Official Teaser",
            "thumbnail": "https://i.ytimg.com/vi/Di310WS8zLk/hqdefault.jpg",
            "duration": "1:02",
            "views": "5.1M",
            "key": "Di310WS8zLk",
            "type": "Teaser",
            "official": true,
            "published_at": "2022-08-17T15:00:00.000Z"
        },
        {
            "id": "629e29a912197e1689f1c62a",
            "title": "Wednesday Addams Revealed",
            "thumbnail": "https://i.ytimg.com/vi/G4QHrAcZalc/hqdefault.jpg",
            "duration": "0:47",
            "views": "6.3M",
            "key": "G4QHrAcZalc",
            "type": "Teaser",
            "official": true,
            "published_at": "2022-06-06T16:03:02.000Z"
        }
    ];


    const reviews = [
        {
            "id": "638a643b0e64af00c25d137e",
            "author": "UtileDulci",
            "avatar": null,
            "rating": 3,
            "content": "Wednesday Mary Sue Addams, I counted at least 10 things she's perfect at. If not for the woke ideology being pushed, this could be a very good tv series. Steer clear.",
            "created_at": "2022-12-02T20:46:51.381Z"
        },
        {
            "author": "Nate Richardson",
            "avatar": "https://image.tmdb.org/t/p/w64_and_h64_face/wBxPum8xMbwLHEFGLJcrUyGeHz8.png",
            "rating": 9,
            "content": "Wednesday's plot focuses on it's surface between the balance of power between normal everyday people (Like you and I), and (I don't know a better way to put it) cryptid kids; Wednesday (played by Jenna Ortega) is part of the latter (obviously).  As the plot thickens, we find out that power struggle between the groups has been ingrained in everyone for generations. You may even say it's been institutionalized since the community's inception. \r\n\r\nPeople can read into this however they want; what really matters is if it works or not.  Given that the kids are literally werewolves, sirens, medusas and other cryptid creatures of lore, it is my opinion if you feel this dynamic is only in place to make you feel fragile, than you need  to (in the words of my grandfather) 'get a tougher skin'.  Honestly, it's a TV show, are you that wounded?\r\n\r\nAs these kids are in fact literally and physically outcasts to our society, their struggles being so and trying to fit in work in this story.  I believe because Wednesday isn't physically a cryptid people expected something else.  She's always been, along with her whole family obviously not normal and thus outcasts like the rest. \r\n\r\nWhat I really enjoyed about this is the dynamic between Jenna and the un-talking member of the Adams' family, Thing (physically played by **Victor Dorobantu**).  The actor wears a green suite except for his hand and contorts his way through every scene. The result is a way more realistic human hand running around than any CGI could have ever done. I also love the duplicity between Wednesday and her trying-to-be / would-be warewolf roommate, Endid (joyfully played by **Emma Myers**).  There are honestly quite a few very likeable supporting characters that make the gloom and doom (that I love) from the main character and balance it into something even more plateable. \r\n\r\nIf your nostalgic for the kooky family, the show has plenty of fan service that isn't too blatant (at least not for everything all the time). You get the finger snaps, you get Christina Ricci (for those 90's kids fans), and you get a pretty accurate Adams Family as compared to the original source material. \r\n\r\nI believe the plots mystery will keep people engaged enough (it's no Knives Out or Glass Onion), but combine that with the strength of the characters and you get a really great TV show worth re-watching;  which is personally one of the highest praise I can put on a TV series.  Highly recommended!",
            "created_at": "2023-01-10T15:30:20.045Z",
            "id": "63bd848cfc31d300a8df6ea2"
        },
        {
            "author": "ProPriyam",
            "avatar": null,
            "rating": 4,
            "content": "One of those hard to endure type fantasy shows. Unnecessary and often predictably silly dialogues, bizarre character relations and motivations, shallow plot. On the bright side the show does get bearable with time plus some great cello music selection.",
            "created_at": "2023-02-08T08:55:14.295Z",
            "id": "63e36372db154f009378450d"
        },
        {
            "author": "numerology company name",
            "avatar": "https://image.tmdb.org/t/p/w64_and_h64_face/tNyjWSfpYSsPdAyuvF97GrieiWM.jpg",
            "rating": null,
            "content": "The show takes viewers on a journey into the mind of Wednesday Addams, exploring her eerie and supernatural world as she grows into her own. The writing is sharp and witty, with a cast of endearing and frightening characters that will keep you on the edge of your seat. The special effects and production design are top-notch, fully immersing viewers into Wednesday's spooky and fantastical world. Overall, I highly recommend Wednesday for fans of the macabre and those looking for a fresh and exciting take on the Addams Family franchise. Don't miss out on this standout series stunning Gleaming Aura!\"",
            "created_at": "2023-02-08T18:43:05.582Z",
            "id": "63e3ed39db154f00ab38a458"
        },
        {
            "author": "Crazypiglady",
            "avatar": "https://image.tmdb.org/t/p/w64_and_h64_face/naRlE5EKeeRJKbsFk0QtrwCmeDj.jpg",
            "rating": 5,
            "content": "Watchable with some good messages and some good lines although the grumpy teenager became a bit tiresome. I felt it was rather a missed opportunity given the large source material available. Or maybe there wasn't enough to Wednesday's character to extend beyond being gloomy for 8 episodes. A good level of humanity given most characters aren't human.",
            "created_at": "2023-03-24T20:41:11.345Z",
            "id": "641e0ae7344a8e00d9e49a66"
        }
    ];

    const [episodes] = useState<EpisodeInfo[]>([
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

    // Filter episodes based on selected season - memoized for performance
    const filteredEpisodes = useMemo(() => 
        episodes.filter(episode => episode.season_number === selectedSeason),
        [episodes, selectedSeason]
    );

    // Memoized callbacks for better performance
    const handleSeasonChange = useCallback((seasonNumber: number) => {
        setSelectedSeason(seasonNumber);
    }, []);

    const handleBackPress = useCallback(() => {
        router.back();
    }, []);

    const handleVideoPress = useCallback((video: VideoInfo) => {
        setSelectedVideo(video);
        setIsVideoModalVisible(true);
    }, []);

    const handleCloseVideoModal = useCallback(() => {
        setIsVideoModalVisible(false);
        setSelectedVideo(null);
    }, []);

    const handleModalRequestClose = useCallback(() => {
        // On web, prevent automatic modal closure from system events
        // Only allow explicit close via close button
        if (Platform.OS === 'web') {
            return;
        }
        handleCloseVideoModal();
    }, [handleCloseVideoModal]);

    return (
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
                >
                    <Feather name='chevron-left' size={24} color={"#ffffff"} />
                </TouchableOpacity>
                {/* Logo */}
                <Image
                    source={movieDetails.network_logo ? { uri: movieDetails.network_logo } : require('@/assets/images/logo.png')}
                    style={{ width: 100, height: 45 }}
                    contentFit='contain'
                    cachePolicy="memory-disk"
                    priority="high"
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
                    source={{ uri: movieDetails.backdrop_url }}
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
                            source={ movieDetails.poster_url ? { uri: movieDetails.poster_url } : require("@/assets/images/icon.png")}
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
                                {movieDetails.isSeries ? "TV Series" : "Movie"}
                            </Text>
                        </View>
                        <Text
                            variant='movieTitle'
                            weight='bold'
                            numberOfLines={3}
                            className='text-white mb-2'
                        >
                            {movieDetails.title}
                        </Text>
                        <View className='flex-row items-center flex-wrap'>
                            <Text variant='small' weight='medium' className='text-gray-300'>{movieDetails?.release_date?.split('-')[0]}</Text>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant='small' weight='medium' className='text-gray-300'>{movieDetails?.language}</Text>
                            {movieDetails?.runtime ? (
                                <>
                                    <Text className="text-gray-500 text-xs mx-2">•</Text>
                                    <Text variant='small' weight='medium' className='text-gray-300'>{movieDetails.runtime} min</Text>
                                </>
                            ) : null}
                        </View>
                        <View className='flex-row items-center mt-2'>
                            <Feather name="star" size={16} color="#fbbf24" />
                            <Text variant='small' weight='semiBold' className='text-yellow-400 ml-1'>{movieDetails.rating}</Text>
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
                    {movieDetails?.genre?.map((genre, index) => (
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
                    {movieDetails?.synopsis || "No synopsis available."}
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
                        decelerationRate="fast"
                        showsVerticalScrollIndicator={false}
                    >
                        {movieDetails.cast.map((cast, index) => (
                            <CastCard key={`cast-${cast.id}`} data={cast} />
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Videos & Trailers */}
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
                        {videos.map((video, index) => (
                            <VideoCard 
                                key={`video-${video.id}`} 
                                data={video} 
                                onPress={handleVideoPress}
                            />
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* Episodes */}
            {movieDetails.isSeries && (
                <View className='mb-8'>
                    <View className='px-4'>
                        {/* Season Selector */}
                        {movieDetails.seasons.length > 1 && (
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
                                    {movieDetails.seasons.map((season) => (
                                        <TouchableOpacity
                                            key={season.id}
                                            onPress={() => handleSeasonChange(season.season_number)}
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
                    </View>
                </View>
            )}

            {/* Reviews */}
            <View className='mb-8'>
                <View className='px-4'>
                    <View className='flex-row items-center justify-between mb-4'>
                        <Text variant='h6' weight='semiBold' className='text-white'>
                            Reviews ({reviews.length})
                        </Text>
                    </View>

                    {reviews.map((review) => (
                        <ReviewCard key={`review-${review.id}`} data={review} />
                    ))}
                </View>
            </View>

            {/* Video Player Modal - Cross Platform */}
            <Modal
                visible={isVideoModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleModalRequestClose}
                transparent={false}
            >
                <View className="flex-1 bg-dark-bg">
                    {/* Modal Header */}
                    <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
                        <View className="flex-1">
                            <Text variant="h6" weight="semiBold" className="text-white" numberOfLines={1}>
                                {selectedVideo?.title}
                            </Text>
                            <Text variant="caption" weight="medium" className="text-gray-400">
                                {selectedVideo?.type} • {selectedVideo?.views} views
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleCloseVideoModal}
                            className="ml-4 p-2"
                            activeOpacity={0.7}
                        >
                            <Feather name="x" size={24} color="#ffffff" />
                        </TouchableOpacity>
                    </View>

                    {/* Video Player Container - Prevent touch propagation */}
                    <View className="flex-1" style={{ pointerEvents: 'box-none' }}>
                        {selectedVideo?.key && (
                            <EmbeddedVideoPlayer videoKey={String(selectedVideo.key)} />
                        )}
                    </View>

                    {/* Video Info */}
                    <View className="p-4 border-t border-gray-700">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text variant="small" weight="semiBold" className="text-white flex-1" numberOfLines={2}>
                                {selectedVideo?.title}
                            </Text>
                            {selectedVideo?.official && (
                                <View className="ml-3 bg-primary px-2 py-1 rounded">
                                    <Text variant="caption" weight="bold" className="text-white">
                                        OFFICIAL
                                    </Text>
                                </View>
                            )}
                        </View>
                        
                        <View className="flex-row items-center flex-wrap">
                            <Text variant="caption" weight="medium" className="text-primary">
                                {selectedVideo?.type}
                            </Text>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant="caption" weight="regular" className="text-gray-400">
                                {selectedVideo?.duration}
                            </Text>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant="caption" weight="regular" className="text-gray-400">
                                {selectedVideo?.views} views
                            </Text>
                            <Text className="text-gray-500 text-xs mx-2">•</Text>
                            <Text variant="caption" weight="regular" className="text-gray-400">
                                {selectedVideo?.published_at && new Date(selectedVideo.published_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

// Cross-platform embedded video player component
const EmbeddedVideoPlayer = memo(({ videoKey }: { videoKey: string }) => {
    const embedUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1&modestbranding=1&rel=0&showinfo=0`;
    const [WebViewComponent, setWebViewComponent] = useState<any>(null);
    
    // Dynamic import for mobile platforms
    useMemo(() => {
        if (Platform.OS !== 'web') {
            import('react-native-webview')
                .then(({ WebView }) => {
                    setWebViewComponent(() => WebView);
                })
                .catch(() => {
                    console.warn('WebView not available');
                });
        }
    }, []);

    if (Platform.OS === 'web') {
        // Web: Use iframe with pointer events to prevent modal closure
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
    } else {
        // Mobile: Use dynamically imported WebView
        if (WebViewComponent) {
            return (
                <WebViewComponent
                    source={{ uri: embedUrl }}
                    style={{ flex: 1 }}
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled
                    domStorageEnabled
                    startInLoadingState
                    scalesPageToFit
                    allowsFullscreenVideo
                />
            );
        }

        // Loading or fallback state
        return (
            <View className="flex-1 items-center justify-center bg-gray-800">
                <Text variant="small" weight="medium" className="text-white text-center px-4">
                    Loading video player...
                </Text>
            </View>
        );
    }
});
EmbeddedVideoPlayer.displayName = 'EmbeddedVideoPlayer';

const CastCard = memo(({ data }: { data: CastInfo }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            className='mr-2 items-center'
            style={{ width: 100 }}
        >
            <Image
                source={data.profile_path ? { uri: data.profile_path } : require("@/assets/images/icon.png")}
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: BorderRadius.md,
                    marginBottom: Spacing.xs
                }}
                placeholder={require("@/assets/images/icon.png")}
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
                {data.name}
            </Text>
            <Text
                variant='caption'
                weight='regular'
                className='text-center text-gray-400'
                numberOfLines={2}
            >
                {data.character}
            </Text>
        </TouchableOpacity>
    )
});
CastCard.displayName = 'CastCard';

const EpisodeCard = memo(({ data }: { data: EpisodeInfo }) => {
    return (
        <TouchableOpacity
            className='mr-4 bg-alt-bg/40 rounded-lg overflow-hidden'
            style={[{ width: 220 }, Shadows.small]}
            activeOpacity={0.8}
        >
            {/* Episode Thumbnail */}
            <View className='relative'>
                <Image
                    source={data.still_path ? { uri: data.still_path } : require("@/assets/images/icon.png")}
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
                        E{data.episode_number}
                    </Text>
                </View>

                {/* Rating Badge */}
                <View className='absolute top-2 right-2 bg-black/70 px-2 py-1 rounded flex-row items-center'>
                    <Feather name="star" size={10} color="#fbbf24" />
                    <Text variant='caption' weight='medium' className='text-white ml-1'>
                        {Number(data.vote_average).toFixed(1)}
                    </Text>
                </View>

                {/* Duration Badge */}
                <View className='absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded'>
                    <Text variant='caption' weight='medium' className='text-white'>
                        {data.runtime}m
                    </Text>
                </View>
            </View>

            {/* Episode Details */}
            <View className='p-3'>
                <Text variant='small' weight='semiBold' className='text-white mb-1' numberOfLines={2}>
                    {data.name}
                </Text>

                <Text variant='caption' weight='medium' className='text-gray-400 mb-2'>
                    {new Date(data.air_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </Text>

                <Text
                    variant='caption'
                    weight='regular'
                    className='text-gray-300'
                    style={{ lineHeight: 14 }}
                    numberOfLines={5}
                >
                    {data.overview}
                </Text>
            </View>
        </TouchableOpacity>
    )
});
EpisodeCard.displayName = 'EpisodeCard';

const ReviewCard = memo(({ data }: { data: ReviewInfo }) => {
    return (
        <View
            key={data.id}
            className='bg-alt-bg/40 rounded-lg p-4 mb-4'
            style={Shadows.small}
        >
            <View className='flex-row items-center mb-3'>
                <Image
                    source={data.avatar ? { uri: data.avatar } : require("@/assets/images/icon.png")}
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
                        {data.author}
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
                            {new Date(data.created_at || new Date()).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>
                </View>
            </View>
            <Text variant='small' weight='regular' className='text-gray-300' numberOfLines={10} style={{ lineHeight: 18 }}>
                {data.content}
            </Text>
        </View>
    )
});
ReviewCard.displayName = 'ReviewCard';

const VideoCard = memo(({ data, onPress }: { data: VideoInfo; onPress: (video: VideoInfo) => void }) => {
    return (
        <TouchableOpacity
            key={data.id}
            className='mr-4 bg-alt-bg/40 rounded-lg overflow-hidden'
            style={[{ width: 200 }, Shadows.small]}
            activeOpacity={0.8}
            onPress={() => onPress(data)}
        >
            <View className='relative'>
                <Image
                    source={data.thumbnail ? { uri: data.thumbnail } : require("@/assets/images/icon.png")}
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
                <View className='absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded'>
                    <Text variant='caption' weight='medium' className='text-white'>
                        {data.duration}
                    </Text>
                </View>
            </View>

            <View className='p-3'>
                <Text variant='small' weight='semiBold' className='text-white mb-1' numberOfLines={2}>
                    {data.title}
                </Text>
                <View className='flex-row items-center justify-between mb-1'>
                    <Text variant='caption' weight='medium' className='text-primary'>
                        {data.type}
                    </Text>
                    <Text variant='caption' weight='regular' className='text-gray-400'>
                        {data.views} views
                    </Text>
                </View>
                <Text variant='caption' weight='regular' className='text-gray-500'>
                    {new Date(data.published_at || new Date()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </Text>
            </View>
        </TouchableOpacity>
    )
});
VideoCard.displayName = 'VideoCard';