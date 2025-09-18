import MovieCard from '@/components/movie-card';
import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { Movie } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function Recommendation() {


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

    const handleMoviePress = (movie: Movie) => {
        router.push(`/movie/${movie.id}?title=${movie.title}`);
    }

    // Update the movie's favorite status in the arrays
    const handleFavoritePress = useCallback((movie: Movie) => {
    }, []);
    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Recommendation' />

            <ScrollView className="px-4 mt-4">
                <FlashList
                    data={recommendation}
                    keyExtractor={(item: Movie) => item.id.toString()}
                    renderItem={({ item, index }: { item: Movie; index: number }) => (
                        <View style={{
                            flex: 1,
                            marginLeft: index % 2 === 0 ? 0 : 8,
                            marginRight: index % 2 === 0 ? 8 : 0
                        }}>
                            <MovieCard
                                data={item}
                                style={{ width: "100%" }}
                                onPress={() => handleMoviePress(item)}
                                onFavoritePress={() => handleFavoritePress(item)} />
                        </View>
                    )}
                    numColumns={2}
                    className='pb-24'
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    ListEmptyComponent={() => (
                        <View className="flex-1 items-center justify-center mt-10">
                            <Text className="text-gray-400 font-montserrat-medium">No results found</Text>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
}