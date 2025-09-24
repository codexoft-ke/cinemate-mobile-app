import MovieCard from '@/components/movie-card';
import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { Movie } from '@/types';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Dimensions, View } from 'react-native';

export default function Favourites() {


    const [favourites, setFavourites] = useState<Movie[]>([
        {
            id: 278,
            title: "The Shawshank Redemption",
            poster: "https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
            isFavorite: true,
            releaseDate: "1994-09-23",
            genre: "Drama",
            rating: 8.712
        },
        {
            id: 238,
            title: "The Godfather",
            poster: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            isFavorite: true,
            releaseDate: "1972-03-24",
            genre: "Drama",
            rating: 8.685
        },
        {
            id: 240,
            title: "The Godfather Part II",
            poster: "https://image.tmdb.org/t/p/original/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
            isFavorite: true,
            releaseDate: "1974-12-20",
            genre: "Drama",
            rating: 8.57
        },
        {
            id: 424,
            title: "Schindler's List",
            poster: "https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
            isFavorite: true,
            releaseDate: "1993-12-15",
            genre: "Drama",
            rating: 8.566
        },
        {
            id: 389,
            title: "12 Angry Men",
            poster: "https://image.tmdb.org/t/p/original/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
            isFavorite: true,
            releaseDate: "1957-04-10",
            genre: "Drama",
            rating: 8.549
        },
        {
            id: 129,
            title: "Spirited Away",
            poster: "https://image.tmdb.org/t/p/original/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
            isFavorite: true,
            releaseDate: "2002-09-20",
            genre: "Animation",
            rating: 8.5
        },
        {
            id: 155,
            title: "The Dark Knight",
            poster: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            isFavorite: true,
            releaseDate: "2008-07-18",
            genre: "Drama",
            rating: 8.523
        },
        {
            id: 19404,
            title: "Dilwale Dulhania Le Jayenge",
            poster: "https://image.tmdb.org/t/p/original/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
            isFavorite: true,
            releaseDate: "1995-10-20",
            genre: "Comedy",
            rating: 8.5
        },
        {
            id: 497,
            title: "The Green Mile",
            poster: "https://image.tmdb.org/t/p/original/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
            isFavorite: true,
            releaseDate: "1999-12-10",
            genre: "Fantasy",
            rating: 8.504
        },
        {
            id: 496243,
            title: "Parasite",
            poster: "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            isFavorite: true,
            releaseDate: "2019-10-11",
            genre: "Comedy",
            rating: 8.498
        }
    ]);

    // Calculate number of columns based on screen width
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = 150; // Minimum card width
    const padding = 32; // Total horizontal padding (16px on each side)
    const spacing = 8; // Space between cards
    
    const numColumns = useMemo(() => {
        const availableWidth = screenWidth - padding;
        const columns = Math.floor(availableWidth / (cardWidth + spacing));
        return Math.max(2, columns); // Minimum 2 columns
    }, [screenWidth]);

    const handleMoviePress = (movie: Movie) => {
        router.push(`/movie/${movie.id}`);
    }

    // Update the movie's favorite status in the arrays
    const handleFavoritePress = useCallback((movie: Movie) => {
        const movieIndex = favourites.findIndex((movies)=>movie.id === movies.id);
        console.log(movieIndex)
        setFavourites((prev)=>{
            const previousData = prev;
            return previousData.filter((movies)=>movie.id !== movies.id);
        })
    }, [favourites]);
    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Favourites' />

            <View className="px-4 mt-4 flex-1">
                <FlashList
                    data={favourites}
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
            </View>
        </View>
    );
}