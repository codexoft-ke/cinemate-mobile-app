import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { Movie } from '@/types';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useCallback, useState } from 'react';
import { ScrollView, View, TextInput } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import MovieCard from '@/components/movie-card';
import { router } from 'expo-router';

export default function SearchScreen() {

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [movies, setMovies] = useState<Movie[]>([]);
    const [sampleMovies, setSampleMovies] = useState<Movie[]>([
        {
            id: 550,
            title: "Fight Club",
            poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/52AfXWuXCHn3UjD17rBruA9f5qb.jpg",
            synopsis: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
            releaseDate: "1999-10-15",
            duration: 139,
            genre: ["Drama", "Thriller"],
            rating: 8.8,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 13,
            title: "Forrest Gump",
            poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
            synopsis: "A man with a low IQ has accomplished great things in his life and been present during significant historic events.",
            releaseDate: "1994-06-23",
            duration: 142,
            genre: ["Drama", "Romance"],
            rating: 8.8,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 278,
            title: "The Shawshank Redemption",
            poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg",
            synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            releaseDate: "1994-09-23",
            duration: 142,
            genre: ["Drama"],
            rating: 9.3,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 238,
            title: "The Godfather",
            poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
            synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
            releaseDate: "1972-03-24",
            duration: 175,
            genre: ["Drama", "Crime"],
            rating: 9.2,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 424,
            title: "Schindler's List",
            poster: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg",
            synopsis: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.",
            releaseDate: "1993-12-15",
            duration: 195,
            genre: ["Drama", "History"],
            rating: 9.0,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 680,
            title: "Pulp Fiction",
            poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
            synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
            releaseDate: "1994-09-10",
            duration: 154,
            genre: ["Crime", "Drama"],
            rating: 8.9,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 155,
            title: "The Dark Knight",
            poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
            synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
            releaseDate: "2008-07-16",
            duration: 152,
            genre: ["Action", "Crime", "Drama"],
            rating: 9.0,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 429,
            title: "The Good, the Bad and the Ugly",
            poster: "https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/Adrip2Jqzw56KeuV2nAxucKMNXA.jpg",
            synopsis: "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
            releaseDate: "1966-12-23",
            duration: 178,
            genre: ["Western"],
            rating: 8.8,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 19404,
            title: "Dilwale Dulhania Le Jayenge",
            poster: "https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/90ez6ArvpO8bvpyIngBuwXOqJm5.jpg",
            synopsis: "Raj is a rich, carefree, happy-go-lucky second generation NRI. Simran is the daughter of Chaudhary Baldev Singh, who in spite of being an NRI is very strict about adherence to Indian values.",
            releaseDate: "1995-10-20",
            duration: 189,
            genre: ["Comedy", "Drama", "Romance"],
            rating: 8.7,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 27205,
            title: "Inception",
            poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            synopsis: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
            releaseDate: "2010-07-15",
            duration: 148,
            genre: ["Action", "Science Fiction", "Thriller"],
            rating: 8.8,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 496243,
            title: "Parasite",
            poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/TU9NIjwzjoKPwQHoHshkBcQZzr.jpg",
            synopsis: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
            releaseDate: "2019-05-30",
            duration: 133,
            genre: ["Comedy", "Thriller", "Drama"],
            rating: 8.6,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 240,
            title: "The Godfather: Part II",
            poster: "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/kGzFbGhp99zva6oZODW5atUtnqi.jpg",
            synopsis: "In the continuing saga of the Corleone crime family, a young Vito Corleone grows up in Sicily and in 1910s New York.",
            releaseDate: "1974-12-20",
            duration: 202,
            genre: ["Drama", "Crime"],
            rating: 9.0,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 389,
            title: "12 Angry Men",
            poster: "https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/qqHQsStV6exghCM7zbObuYBiYxw.jpg",
            synopsis: "The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father.",
            releaseDate: "1957-04-10",
            duration: 97,
            genre: ["Drama"],
            rating: 9.0,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 129,
            title: "Spirited Away",
            poster: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg",
            synopsis: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
            releaseDate: "2001-07-20",
            duration: 125,
            genre: ["Animation", "Family", "Supernatural"],
            rating: 8.6,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 497,
            title: "The Green Mile",
            poster: "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/Df6pCr7BNgGfHjWgJZrzQ2mLt3y.jpg",
            synopsis: "A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people's ailments.",
            releaseDate: "1999-12-10",
            duration: 189,
            genre: ["Fantasy", "Drama", "Crime"],
            rating: 8.6,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 872585,
            title: "Oppenheimer",
            poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg",
            synopsis: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
            releaseDate: "2023-07-21",
            duration: 180,
            genre: ["Drama", "History"],
            rating: 8.4,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 769,
            title: "GoodFellas",
            poster: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/sw7mordbZxgITU877yTpZCud90M.jpg",
            synopsis: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
            releaseDate: "1990-09-12",
            duration: 146,
            genre: ["Drama", "Crime"],
            rating: 8.7,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 346,
            title: "Seven Samurai",
            poster: "https://image.tmdb.org/t/p/w500/8OKmBV5BUFzmozIC3pPWKHy17kx.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/sJNNMCc6B7KZIY3LH3JMYJJNH5j.jpg",
            synopsis: "A samurai answers a village's request for protection after he falls on hard times. The town needs protection from bandits, so the samurai gathers six others to help him teach the people how to defend themselves.",
            releaseDate: "1954-04-26",
            duration: 207,
            genre: ["Action", "Drama"],
            rating: 8.6,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 324857,
            title: "Spider-Man: Into the Spider-Verse",
            poster: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/7d6EY00g1c39SGZOoCJ5Py9nNth.jpg",
            synopsis: "Struggling to find his place in the world while juggling school and family, Brooklyn teenager Miles Morales is unexpectedly bitten by a radioactive spider.",
            releaseDate: "2018-12-14",
            duration: 117,
            genre: ["Animation", "Action", "Adventure"],
            rating: 8.4,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 11216,
            title: "Cinema Paradiso",
            poster: "https://image.tmdb.org/t/p/w500/8SRUfRUi6x4O68n0VCbDNRa6iGL.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/loRmRzQXZeqG78TqZuyvSlEQfZb.jpg",
            synopsis: "A filmmaker recalls his childhood, when he fell in love with the movies at his village's theater and formed a deep friendship with the theater's projectionist.",
            releaseDate: "1988-11-17",
            duration: 155,
            genre: ["Drama", "Romance"],
            rating: 8.5,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 372058,
            title: "Your Name.",
            poster: "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/7prYzufdIOy1KCTZKVWpjBFqqNr.jpg",
            synopsis: "High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.",
            releaseDate: "2016-08-26",
            duration: 106,
            genre: ["Romance", "Animation", "Drama"],
            rating: 8.5,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 122,
            title: "The Lord of the Rings: The Return of the King",
            poster: "https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/2u7zbn8EudG6kLlBzUYqP8RyFU4.jpg",
            synopsis: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron's forces.",
            releaseDate: "2003-12-17",
            duration: 201,
            genre: ["Adventure", "Fantasy", "Action"],
            rating: 8.9,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 761053,
            title: "Gabriel's Inferno",
            poster: "https://image.tmdb.org/t/p/w500/oyG9TL7FcRP4EZ9Vid6uKzwdndz.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/jtAI6OJIWLWiRItNSZoWjrsUtmi.jpg",
            synopsis: "An intriguing and sinful exploration of seduction, forbidden love, and redemption, Gabriel's Inferno is a captivating and wildly passionate tale of one man's escape from his own personal hell as he tries to earn the impossible.",
            releaseDate: "2020-05-29",
            duration: 122,
            genre: ["Romance", "Drama"],
            rating: 8.9,
            isFavorite: false,
            isSeries: false
        },
        {
            id: 14,
            title: "American Beauty",
            poster: "https://image.tmdb.org/t/p/w500/wby9315QzVKdW9BonAefg8jGTTb.jpg",
            backdrop: "https://image.tmdb.org/t/p/w500/8ULmn1hP6WvZ2FKkNwfF0xqcffX.jpg",
            synopsis: "Lester Burnham, a depressed suburban father in a mid-life crisis, decides to turn his hectic life around after developing an infatuation with his daughter's attractive friend.",
            releaseDate: "1999-10-01",
            duration: 122,
            genre: ["Drama"],
            rating: 8.3,
            isFavorite: false,
            isSeries: false
        }
    ])


    //  Search Functionallity to be implemented
    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            setMovies([]);
            return;
        }

        const filteredMovies = sampleMovies.filter((movie: Movie) =>
            (movie.title?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
            (Array.isArray(movie.genre) && (movie.genre as string[]).some((g: string) => g.toLowerCase().includes(query.toLowerCase()))) ||
            (movie.synopsis?.toLowerCase().includes(query.toLowerCase()) ?? false)
        );

        setMovies(filteredMovies);
    };

    const handleMoviePress = (movie: Movie) => {
        router.push(`/movie/${movie.id}?title=${movie.title}`);
    }

    // Update the movie's favorite status in the arrays
    const handleFavoritePress = useCallback((movie: Movie) => {
    }, []);


return (
    <View className='flex-1 bg-dark-bg' >
        <AppHeader title='Search' />
        <View className='flex-row items-center bg-[#192C40] mx-4 mt-3 rounded-full px-4 py-2'>
            <Feather name="search" size={24} color="white" style={{ fontWeight: 'bold' }} />
            <TextInput
                className='text-white ml-3 flex-1 font-montserrat-medium py-2 focus-visible:outline-none'
                placeholder="Search for movies, TV shows..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={handleSearch}
                returnKeyType="search"
            />
            <Feather name="sliders" size={24} color="white" style={{ fontWeight: 'bold' }} />
        </View>

        {/* Search Results: Displayed in using Flashlist with 2 col min */}
        <ScrollView className="px-4 mt-4">
            <FlashList
                data={movies}
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