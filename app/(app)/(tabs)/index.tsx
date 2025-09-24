import MovieCard from '@/components/movie-card';
import { Text } from '@/components/ui/app-text';
import SectionHeader from '@/components/ui/section-header';
import { CineMateColors } from '@/constants/theme';
import { Movie } from '@/types';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useState } from 'react';
import { Dimensions, Platform, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');


interface Category {
    id: number | string;
    name: string;
}

export default function HomeScreen() {

    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([
        {
            id: 1311031,
            title: "Demon Slayer: Kimetsu no Yaiba Infinity Castle",
            poster: "https://image.tmdb.org/t/p/w500/1RgPyOhN4DRs225BGTlHJqCudII.jpg",
            isFavorite: false,
            isSeries: true,
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
    ])

    const [recommendation, setRecommendation] = useState<Movie[]>([
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
    ]);

    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([
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
    ]);

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
