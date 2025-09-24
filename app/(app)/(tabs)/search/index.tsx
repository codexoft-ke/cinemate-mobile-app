import MovieCard from '@/components/movie-card';
import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { Movie } from '@/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Dimensions, Modal, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

    // Filter states
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedYearRange, setSelectedYearRange] = useState<{ min: number; max: number } | null>(null);
    const [selectedRatingRange, setSelectedRatingRange] = useState<{ min: number; max: number } | null>(null);
    const [selectedContentType, setSelectedContentType] = useState<'all' | 'movie' | 'series'>('all');

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
    const [sampleMovies] = useState<Movie[]>([
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


    //  Search and Filter Functionality
    const applyFilters = (movieList: Movie[], query: string = searchQuery) => {
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
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (query.trim() === '' && selectedGenres.length === 0 && !selectedYearRange && !selectedRatingRange && selectedContentType === 'all') {
            setMovies([]);
            return;
        }

        const filteredMovies = applyFilters(sampleMovies, query);
        setMovies(filteredMovies);
    };

    // Update movies when filters change
    const updateFilters = () => {
        const filteredMovies = applyFilters(sampleMovies);
        setMovies(filteredMovies);
        setShowFilterModal(false);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedGenres([]);
        setSelectedYearRange(null);
        setSelectedRatingRange(null);
        setSelectedContentType('all');
        if (searchQuery.trim() === '') {
            setMovies([]);
        } else {
            const filteredMovies = applyFilters(sampleMovies);
            setMovies(filteredMovies);
        }
    };

    // Check if any filters are active
    const hasActiveFilters = selectedGenres.length > 0 || selectedYearRange !== null || selectedRatingRange !== null || selectedContentType !== 'all';

    const handleMoviePress = (movie: Movie) => {
        router.push(`/movie/${movie.id}`);
    }

    // Update the movie's favorite status in the arrays
    const handleFavoritePress = useCallback((movie: Movie) => {
    }, []);


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
                    onChangeText={handleSearch}
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

            {/* Active Filters Display - Tight spacing */}
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

            {/* Search Results - Tight spacing */}
            <View className="px-4 mt-1 flex-1">
                <FlashList
                    data={movies}
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
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    ListEmptyComponent={() => (
                        <View className="flex-1 items-center justify-center mt-10">
                            <Text className="text-gray-400 font-montserrat-medium">No results found</Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                />
            </View>

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                animationType="slide"
                transparent={true}
                className=''
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View className='flex-1 bg-black/50 backdrop-blur-sm justify-end'>
                    <View className='max-w-[600px] max-h-[600px] self-center flex-1 rounded-t-xl bg-dark-bg'>
                        {/* Modal Header */}
                        <View className='flex-row items-center justify-between px-5 py-3 border-b-2 border-alt-bg'>
                            <Text className='text-white text-lg' color='#FFFFFF' variant='h4' weight='bold' >Filters</Text>
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

                            {/* Content Type Filter - Test Section */}
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
                                        <Text color="white" weight='semiBold' variant='small' >All</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setSelectedContentType('movie')}
                                        className='flex-1 px-4 py-3 rounded-lg items-center'
                                        style={{
                                            backgroundColor: selectedContentType === 'movie' ? '#9810FA' : '#374151',
                                        }}
                                    >
                                        <Text color="white" weight='semiBold' variant='small' >Movies</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setSelectedContentType('series')}
                                        className='flex-1 px-4 py-3 rounded-lg items-center'
                                        style={{
                                            backgroundColor: selectedContentType === 'series' ? '#9810FA' : '#374151',
                                        }}
                                    >
                                        <Text color="white" weight='semiBold' variant='small' >Series</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Genres Filter */}
                            <View className='p-5'>
                                <Text className='text-lg mb-2' variant='h6' color='#FFFFFF' weight='semiBold'>
                                    Genres
                                </Text>
                                <View className='flex-1'>
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