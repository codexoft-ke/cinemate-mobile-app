import MovieCard from '@/components/movie-card';
import { AppHeader } from '@/components/ui/app-header';
import SectionHeader from '@/components/ui/section-header';
import { Movie } from '@/types';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';

export default function Recommendation() {
    // Card dimensions for horizontal scroll
    const cardWidth = 140; // Card width for horizontal scroll
    const cardHeight = 200; // Card height for horizontal scroll

    // Sample movie data organized by sections
    const [newAndTrending] = useState<Movie[]>([
        {
            id: 278,
            title: "The Shawshank Redemption",
            poster: "https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
            is_favorite: false,
            releaseDate: "1994-09-23",
            genre: "Drama",
            rating: 8.712
        },
        {
            id: 238,
            title: "The Godfather",
            poster: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            is_favorite: false,
            releaseDate: "1972-03-24",
            genre: "Drama",
            rating: 8.685
        },
        {
            id: 240,
            title: "The Godfather Part II",
            poster: "https://image.tmdb.org/t/p/original/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
            is_favorite: false,
            releaseDate: "1974-12-20",
            genre: "Drama",
            rating: 8.57
        },
        {
            id: 424,
            title: "Schindler's List",
            poster: "https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
            is_favorite: false,
            releaseDate: "1993-12-15",
            genre: "Drama",
            rating: 8.566
        },
        {
            id: 389,
            title: "12 Angry Men",
            poster: "https://image.tmdb.org/t/p/original/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
            is_favorite: false,
            releaseDate: "1957-04-10",
            genre: "Drama",
            rating: 8.549
        },
        {
            id: 129,
            title: "Spirited Away",
            poster: "https://image.tmdb.org/t/p/original/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
            is_favorite: false,
            releaseDate: "2002-09-20",
            genre: "Animation",
            rating: 8.5
        },
        {
            id: 155,
            title: "The Dark Knight",
            poster: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            is_favorite: false,
            releaseDate: "2008-07-18",
            genre: "Drama",
            rating: 8.523
        },
        {
            id: 19404,
            title: "Dilwale Dulhania Le Jayenge",
            poster: "https://image.tmdb.org/t/p/original/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
            is_favorite: false,
            releaseDate: "1995-10-20",
            genre: "Comedy",
            rating: 8.5
        },
        {
            id: 497,
            title: "The Green Mile",
            poster: "https://image.tmdb.org/t/p/original/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
            is_favorite: false,
            releaseDate: "1999-12-10",
            genre: "Fantasy",
            rating: 8.504
        },
        {
            id: 496243,
            title: "Parasite",
            poster: "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            is_favorite: false,
            releaseDate: "2019-10-11",
            genre: "Comedy",
            rating: 8.498
        }
    ]);

    const [recommendedForYou] = useState<Movie[]>([
        {
            id: 278,
            title: "The Shawshank Redemption",
            poster: "https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
            is_favorite: false,
            releaseDate: "1994-09-23",
            genre: "Drama",
            rating: 8.712
        },
        {
            id: 238,
            title: "The Godfather",
            poster: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            is_favorite: false,
            releaseDate: "1972-03-24",
            genre: "Drama",
            rating: 8.685
        },
        {
            id: 240,
            title: "The Godfather Part II",
            poster: "https://image.tmdb.org/t/p/original/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
            is_favorite: false,
            releaseDate: "1974-12-20",
            genre: "Drama",
            rating: 8.57
        },
        {
            id: 424,
            title: "Schindler's List",
            poster: "https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
            is_favorite: false,
            releaseDate: "1993-12-15",
            genre: "Drama",
            rating: 8.566
        },
        {
            id: 389,
            title: "12 Angry Men",
            poster: "https://image.tmdb.org/t/p/original/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
            is_favorite: false,
            releaseDate: "1957-04-10",
            genre: "Drama",
            rating: 8.549
        },
        {
            id: 129,
            title: "Spirited Away",
            poster: "https://image.tmdb.org/t/p/original/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
            is_favorite: false,
            releaseDate: "2002-09-20",
            genre: "Animation",
            rating: 8.5
        },
        {
            id: 155,
            title: "The Dark Knight",
            poster: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            is_favorite: false,
            releaseDate: "2008-07-18",
            genre: "Drama",
            rating: 8.523
        },
        {
            id: 19404,
            title: "Dilwale Dulhania Le Jayenge",
            poster: "https://image.tmdb.org/t/p/original/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
            is_favorite: false,
            releaseDate: "1995-10-20",
            genre: "Comedy",
            rating: 8.5
        },
        {
            id: 497,
            title: "The Green Mile",
            poster: "https://image.tmdb.org/t/p/original/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
            is_favorite: false,
            releaseDate: "1999-12-10",
            genre: "Fantasy",
            rating: 8.504
        },
        {
            id: 496243,
            title: "Parasite",
            poster: "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            is_favorite: false,
            releaseDate: "2019-10-11",
            genre: "Comedy",
            rating: 8.498
        }
    ]);

    const [favoriteGenres] = useState<Movie[]>([
        {
            id: 278,
            title: "The Shawshank Redemption",
            poster: "https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
            is_favorite: false,
            releaseDate: "1994-09-23",
            genre: "Drama",
            rating: 8.712
        },
        {
            id: 238,
            title: "The Godfather",
            poster: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            is_favorite: false,
            releaseDate: "1972-03-24",
            genre: "Drama",
            rating: 8.685
        },
        {
            id: 240,
            title: "The Godfather Part II",
            poster: "https://image.tmdb.org/t/p/original/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
            is_favorite: false,
            releaseDate: "1974-12-20",
            genre: "Drama",
            rating: 8.57
        },
        {
            id: 424,
            title: "Schindler's List",
            poster: "https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
            is_favorite: false,
            releaseDate: "1993-12-15",
            genre: "Drama",
            rating: 8.566
        },
        {
            id: 389,
            title: "12 Angry Men",
            poster: "https://image.tmdb.org/t/p/original/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
            is_favorite: false,
            releaseDate: "1957-04-10",
            genre: "Drama",
            rating: 8.549
        },
        {
            id: 129,
            title: "Spirited Away",
            poster: "https://image.tmdb.org/t/p/original/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
            is_favorite: false,
            releaseDate: "2002-09-20",
            genre: "Animation",
            rating: 8.5
        },
        {
            id: 155,
            title: "The Dark Knight",
            poster: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            is_favorite: false,
            releaseDate: "2008-07-18",
            genre: "Drama",
            rating: 8.523
        },
        {
            id: 19404,
            title: "Dilwale Dulhania Le Jayenge",
            poster: "https://image.tmdb.org/t/p/original/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
            is_favorite: false,
            releaseDate: "1995-10-20",
            genre: "Comedy",
            rating: 8.5
        },
        {
            id: 497,
            title: "The Green Mile",
            poster: "https://image.tmdb.org/t/p/original/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
            is_favorite: false,
            releaseDate: "1999-12-10",
            genre: "Fantasy",
            rating: 8.504
        },
        {
            id: 496243,
            title: "Parasite",
            poster: "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            is_favorite: false,
            releaseDate: "2019-10-11",
            genre: "Comedy",
            rating: 8.498
        }
    ]);

    const [basedOnExploring] = useState<Movie[]>([
        {
            id: 278,
            title: "The Shawshank Redemption",
            poster: "https://image.tmdb.org/t/p/original/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg",
            is_favorite: false,
            releaseDate: "1994-09-23",
            genre: "Drama",
            rating: 8.712
        },
        {
            id: 238,
            title: "The Godfather",
            poster: "https://image.tmdb.org/t/p/original/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            is_favorite: false,
            releaseDate: "1972-03-24",
            genre: "Drama",
            rating: 8.685
        },
        {
            id: 240,
            title: "The Godfather Part II",
            poster: "https://image.tmdb.org/t/p/original/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
            is_favorite: false,
            releaseDate: "1974-12-20",
            genre: "Drama",
            rating: 8.57
        },
        {
            id: 424,
            title: "Schindler's List",
            poster: "https://image.tmdb.org/t/p/original/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
            is_favorite: false,
            releaseDate: "1993-12-15",
            genre: "Drama",
            rating: 8.566
        },
        {
            id: 389,
            title: "12 Angry Men",
            poster: "https://image.tmdb.org/t/p/original/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
            is_favorite: false,
            releaseDate: "1957-04-10",
            genre: "Drama",
            rating: 8.549
        },
        {
            id: 129,
            title: "Spirited Away",
            poster: "https://image.tmdb.org/t/p/original/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
            is_favorite: false,
            releaseDate: "2002-09-20",
            genre: "Animation",
            rating: 8.5
        },
        {
            id: 155,
            title: "The Dark Knight",
            poster: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            is_favorite: false,
            releaseDate: "2008-07-18",
            genre: "Drama",
            rating: 8.523
        },
        {
            id: 19404,
            title: "Dilwale Dulhania Le Jayenge",
            poster: "https://image.tmdb.org/t/p/original/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
            is_favorite: false,
            releaseDate: "1995-10-20",
            genre: "Comedy",
            rating: 8.5
        },
        {
            id: 497,
            title: "The Green Mile",
            poster: "https://image.tmdb.org/t/p/original/8VG8fDNiy50H4FedGwdSVUPoaJe.jpg",
            is_favorite: false,
            releaseDate: "1999-12-10",
            genre: "Fantasy",
            rating: 8.504
        },
        {
            id: 496243,
            title: "Parasite",
            poster: "https://image.tmdb.org/t/p/original/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            is_favorite: false,
            releaseDate: "2019-10-11",
            genre: "Comedy",
            rating: 8.498
        }
    ]);

    const handleMoviePress = (movie: Movie) => {
        router.push(`/movie/${movie.id}`);
    }

    // Update the movie's favorite status in the arrays
    const handleFavoritePress = useCallback((movie: Movie) => {
        // TODO: Implement favorite toggle logic
    }, []);

    // Render horizontal movie list component
    const renderHorizontalMovieList = (movies: Movie[], sectionTitle: string) => (
        <View className="mb-6 px-4">
            <SectionHeader 
                title={sectionTitle} 
                showButton={false}
            />
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                    contentContainerClassName={`pr-2 gap-3 ${Platform.OS === "web" && "overflow-x-scroll w-full custom-scrollbar"}`}
            >
                {movies.map((movie, index) => (
                    <View 
                        key={movie.id} 
                        style={{ 
                            width: cardWidth, 
                            marginRight: index === movies.length - 1 ? 16 : 12 
                        }}
                    >
                        <MovieCard
                            data={movie}
                            onPress={() => handleMoviePress(movie)}
                            onFavoritePress={() => handleFavoritePress(movie)}
                            style={{ width: cardWidth, height: cardHeight }}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Recommendation' />

            <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* New & Trending for You */}
                {renderHorizontalMovieList(newAndTrending, "New & Trending for You")}

                {/* Recommended for You */}
                {renderHorizontalMovieList(recommendedForYou, "Recommended for You")}

                {/* Your Favorite Genres */}
                {renderHorizontalMovieList(favoriteGenres, "Your Favorite Genres")}

                {/* Based on Your Exploring */}
                {renderHorizontalMovieList(basedOnExploring, "Based on Your Exploring")}
            </ScrollView>
        </View>
    );
}