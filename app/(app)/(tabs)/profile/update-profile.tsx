import { ActivityIndicator, TextInput, View, TouchableOpacity, Platform, Modal, ScrollView, Dimensions } from 'react-native';
import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { CineMateColors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { useMovies, useProfile } from '@/hooks/use-api';
import { Toast } from 'react-native-toast-notifications';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface Genre {
    id: string;
    name: string;
}

interface InputError {
    error: boolean;
    message: string;
}

interface InputErrors {
    name: InputError;
    email_address: InputError;
    password: InputError;
    c_password: InputError;
}

const genreColors: { [key: string]: string } = {
    'Action': CineMateColors.action,
    'Comedy': CineMateColors.comedy,
    'Drama': CineMateColors.drama,
    'Horror': CineMateColors.horror,
    'Romance': CineMateColors.romance,
    'Sci-Fi': CineMateColors.sciFi,
    'Science Fiction': CineMateColors.sciFi,
    'Thriller': CineMateColors.thriller,
    'Adventure': '#FF6B35',
    'Animation': '#4ECDC4',
    'Crime': '#556B2F',
    'Documentary': '#CD853F',
    'Family': '#FFB6C1',
    'Fantasy': '#9370DB',
    'History': '#8B4513',
    'Music': '#FF1493',
    'Mystery': '#2F4F4F',
    'War': '#800000',
    'Western': '#DAA520',
    'Action & Adventure': '#FF6B35',
    'Kids': '#FFB6C1',
    'News': '#4682B4',
    'Reality': '#DDA0DD',
    'Sci-Fi & Fantasy': CineMateColors.sciFi,
    'Soap': '#F0E68C',
    'Talk': '#87CEEB',
    'TV Movie': '#B0C4DE',
    'War & Politics': '#696969',
};

const getGenreIcon = (genreName: string): keyof typeof Feather.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Feather.glyphMap } = {
        'Action': 'zap',
        'Comedy': 'smile',
        'Drama': 'heart',
        'Horror': 'eye',
        'Romance': 'heart',
        'Sci-Fi': 'cpu',
        'Science Fiction': 'cpu',
        'Thriller': 'alert-triangle',
        'Adventure': 'map',
        'Animation': 'film',
        'Crime': 'shield',
        'Documentary': 'camera',
        'Family': 'home',
        'Fantasy': 'star',
        'History': 'clock',
        'Music': 'music',
        'Mystery': 'help-circle',
        'War': 'crosshair',
        'Western': 'sun',
        'Action & Adventure': 'map',
        'Kids': 'smile',
        'News': 'tv',
        'Reality': 'users',
        'Sci-Fi & Fantasy': 'cpu',
        'Soap': 'tv',
        'Talk': 'message-circle',
        'TV Movie': 'tv',
        'War & Politics': 'flag',
    };

    return iconMap[genreName] || 'film';
};

export default function UpdateProfile() {
    const { user } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isLoading, setIsLoading] = useState(false);

    const [inputErrors, setInputErrors] = useState<InputErrors>({
        name: {
            error: false,
            message: ""
        },
        email_address: {
            error: false,
            message: ""
        },
        password: {
            error: false,
            message: ""
        },
        c_password: {
            error: false,
            message: ""
        },
    });

    // Default genres list as fallback
    const defaultGenres: Genre[] = [
        { "id": "28", "name": "Action" },
        { "id": "10759", "name": "Action & Adventure" },
        { "id": "12", "name": "Adventure" },
        { "id": "16", "name": "Animation" },
        { "id": "35", "name": "Comedy" },
        { "id": "80", "name": "Crime" },
        { "id": "99", "name": "Documentary" },
        { "id": "18", "name": "Drama" },
        { "id": "10751", "name": "Family" },
        { "id": "14", "name": "Fantasy" },
        { "id": "36", "name": "History" },
        { "id": "27", "name": "Horror" },
        { "id": "10762", "name": "Kids" },
        { "id": "10402", "name": "Music" },
        { "id": "9648", "name": "Mystery" },
        { "id": "10763", "name": "News" },
        { "id": "10764", "name": "Reality" },
        { "id": "10749", "name": "Romance" },
        { "id": "878", "name": "Science Fiction" },
        { "id": "10765", "name": "Sci-Fi & Fantasy" },
        { "id": "10766", "name": "Soap" },
        { "id": "10767", "name": "Talk" },
        { "id": "53", "name": "Thriller" },
        { "id": "10770", "name": "TV Movie" },
        { "id": "10752", "name": "War" },
        { "id": "10768", "name": "War & Politics" },
        { "id": "37", "name": "Western" }
    ];

    // Genre selection state
    const [genres, setGenres] = useState<Genre[]>(defaultGenres);
    const [selectedGenres, setSelectedGenres] = useState<string[]>(
        Array.isArray(user?.genres)
            ? user.genres.map((g: any) => String(g))
            : []
    );
    const [showGenreModal, setShowGenreModal] = useState(false);
    const [loadingGenres, setLoadingGenres] = useState(false);

    // Fetch genres when component mounts
    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        setLoadingGenres(true);
        try {
            const response = await useMovies.genres();
            if (response.success && 'data' in response) {
                const data = response.data as { genres: Genre[] };
                if (data.genres && data.genres.length > 0) {
                    setGenres(data.genres);
                }
            }
        } catch (error) {
            console.error('Failed to fetch genres:', error);
            Toast.show('Failed to load genres. Using default list.', {
                type: "warning",
                duration: 3500,
            });
        } finally {
            setLoadingGenres(false);
        }
    };

    const clearInputErrors = () => {
        setInputErrors({
            name: { error: false, message: "" },
            email_address: { error: false, message: "" },
            password: { error: false, message: "" },
            c_password: { error: false, message: "" },
        });
    };

    const validateInputs = (): boolean => {
        const errors = {
            name: {
                error: !name || name.trim().length < 2,
                message: !name ? "Name is required" : name.trim().length < 2 ? "Name must be at least 2 characters" : ""
            },
            email_address: {
                error: !email || !/\S+@\S+\.\S+/.test(email),
                message: !email ? "Email is required" : !/\S+@\S+\.\S+/.test(email) ? "Please enter a valid email address" : ""
            },
            password: {
                error: false,
                message: ""
            },
            c_password: {
                error: false,
                message: ""
            }
        };

        setInputErrors(errors);
        return !errors.name.error && !errors.email_address.error;
    };

    const toggleGenreSelection = (genreId: string) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        setSelectedGenres(prev => {
            if (prev.includes(genreId)) {
                return prev.filter(id => id !== genreId);
            } else {
                return [...prev, genreId];
            }
        });
    };

    const handleUpdateProfile = useCallback(async () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        clearInputErrors(); // Clear any previous errors
        
        try {
            const response = await useProfile.updateInfo({ 
                name: name.trim(), 
                email: email.trim(), 
                genres: selectedGenres 
            });
            
            if (!response.success) {
                const errorResponse = response as any; // ApiError type
                throw errorResponse;
            }

            Toast.show('Profile updated successfully!', {
                type: "success",
                duration: 3500,
            });
            
        } catch (error: any) {
            // Check if it's a validation error (ApiError with validation details)
            if (error && !error.success && error.error?.details) {
                const validationErrors = error.error.details;

                // Handle non_field_errors as a general error alert
                if (validationErrors && validationErrors.non_field_errors && validationErrors.non_field_errors.length > 0) {
                    Toast.show(validationErrors.non_field_errors.join('\n'), {
                        type: "danger",
                        duration: 3500,
                    });
                    return;
                }

                if (validationErrors) {
                    // Update form errors with server validation
                    const updatedErrors = { ...inputErrors };

                    // Map server field names to form field names
                    const fieldMapping: { [key: string]: keyof typeof updatedErrors } = {
                        'email': 'email_address', // Server uses 'email', form uses 'email_address' for display
                        'name': 'name'
                    };

                    Object.keys(validationErrors).forEach(field => {
                        const formField = fieldMapping[field] || field as keyof typeof updatedErrors;
                        if (updatedErrors[formField] && validationErrors[field] && validationErrors[field].length > 0) {
                            updatedErrors[formField] = {
                                error: true,
                                message: validationErrors[field][0] // Take first error message
                            };
                        }
                    });
                    setInputErrors(updatedErrors);
                } else {
                    Toast.show(error.message || 'Validation failed. Please check your inputs.', {
                        type: "danger",
                        duration: 3500,
                    });
                }
            } else if (error && error.errors) {
                // Handle the original error format from your existing code
                const errors = error.errors as { [key: string]: string[] };
                const newInputErrors = { ...inputErrors };

                Object.keys(newInputErrors).forEach((key) => {
                    if (errors[key]) {
                        newInputErrors[key as keyof InputErrors] = {
                            error: true,
                            message: errors[key][0],
                        };
                    } else {
                        newInputErrors[key as keyof InputErrors] = {
                            error: false,
                            message: "",
                        };
                    }
                });

                setInputErrors(newInputErrors);
            } else {
                Toast.show(error.message || 'An error occurred while updating profile. Please try again.', {
                    type: "danger",
                    duration: 3500,
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [name, email, selectedGenres]);

    const getGenreColor = (genreName: string): string => {
        return genreColors[genreName] || CineMateColors.primary;
    };

    const isFormValid = name?.trim().length > 0 && email?.trim().length > 0;

    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Update Profile' showRightIcon={false} />
            <ScrollView className="px-4 flex-1" showsVerticalScrollIndicator={false}>

                <View className="items-center mb-8 mt-4">
                    <View className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 items-center justify-center mb-4 shadow-lg">
                        <View className="w-20 h-20 rounded-full bg-alt-bg items-center justify-center">
                            <Feather name="user" size={32} color={CineMateColors.primary} />
                        </View>
                    </View>
                    <Text variant="h4" weight="bold" color="#FFFFFF" className="mb-2">
                        {user?.name || 'Update Your Profile'}
                    </Text>
                    <Text variant="body" color={CineMateColors.textSecondary} className="text-center">
                        Keep your information current for the best experience
                    </Text>
                </View>

                {/* Name Input */}
                <View className="mb-4">
                    <Text color="#FFFFFF" variant="body" weight="medium" className="mb-2">
                        Full Name
                    </Text>
                    <TextInput
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            // Clear error when user starts typing
                            if (inputErrors.name.error) {
                                setInputErrors(prev => ({
                                    ...prev,
                                    name: { error: false, message: "" }
                                }));
                            }
                        }}
                        placeholder="Enter your full name"
                        placeholderTextColor={CineMateColors.textSecondary}
                        autoComplete="name"
                        className={`font-medium bg-alt-bg text-white text-base rounded-md p-4 border ${inputErrors.name.error ? "border-red-600" : "border-transparent"} focus-visible:outline-none`}
                    />
                    {inputErrors.name.error && (
                        <View className="pt-2">
                            <Text color="red" weight="semiBold">
                                {inputErrors.name.message}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Email Input */}
                <View className="mb-4">
                    <Text color="#FFFFFF" variant="body" weight="medium" className="mb-2">
                        Email
                    </Text>
                    <TextInput
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            // Clear error when user starts typing
                            if (inputErrors.email_address.error) {
                                setInputErrors(prev => ({
                                    ...prev,
                                    email_address: { error: false, message: "" }
                                }));
                            }
                        }}
                        placeholder="Enter your email"
                        placeholderTextColor={CineMateColors.textSecondary}
                        autoCapitalize="none"
                        autoComplete="email"
                        keyboardType="email-address"
                        className={`font-medium bg-alt-bg text-white text-base rounded-md p-4 border ${inputErrors.email_address.error ? "border-red-600" : "border-transparent"} focus-visible:outline-none`}
                    />
                    {inputErrors.email_address.error && (
                        <View className="pt-2">
                            <Text color="red" weight="semiBold">
                                {inputErrors.email_address.message}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Genre Selection */}
                <View className="mb-6">
                    <Text color="#FFFFFF" variant="body" weight="medium" className="mb-3">
                        Favorite Genres
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (Platform.OS === 'ios') {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }
                            setShowGenreModal(true);
                        }}
                        className="bg-alt-bg rounded-md p-4 border border-transparent"
                        style={{ minHeight: 56 }}
                        disabled={loadingGenres}
                        accessible={true}
                        accessibilityLabel="Select favorite genres"
                        accessibilityHint="Opens genre selection modal"
                    >
                        {loadingGenres ? (
                            <View className="flex-row items-center">
                                <ActivityIndicator size="small" color={CineMateColors.textSecondary} />
                                <Text color={CineMateColors.textSecondary} variant="body" className="ml-3">
                                    Loading genres...
                                </Text>
                            </View>
                        ) : selectedGenres.length === 0 ? (
                            <View className="flex-row items-center">
                                <Text color={CineMateColors.textSecondary} variant="body" className="flex-1">
                                    Select your favorite genres
                                </Text>
                                <Feather name="chevron-right" size={20} color={CineMateColors.textSecondary} />
                            </View>
                        ) : (
                            <View>
                                <View className="flex-row flex-wrap">
                                    {selectedGenres.slice(0, 3).map((genreId) => {
                                        const genre = genres.find(g => g.id === genreId);
                                        return genre ? (
                                            <View
                                                key={genreId}
                                                className="rounded-full px-3 py-1 mr-2 mb-2"
                                                style={{ backgroundColor: `${getGenreColor(genre.name)}20` }}
                                            >
                                                <Text
                                                    variant="caption"
                                                    weight="medium"
                                                    style={{ color: getGenreColor(genre.name) }}
                                                >
                                                    {genre.name}
                                                </Text>
                                            </View>
                                        ) : null;
                                    })}
                                </View>
                                {selectedGenres.length > 3 && (
                                    <Text color={CineMateColors.textSecondary} variant="caption" className="mt-1">
                                        +{selectedGenres.length - 3} more selected
                                    </Text>
                                )}
                                <View className="absolute top-0 right-0 mt-2 mr-2">
                                    <Feather name="edit-2" size={16} color={CineMateColors.textSecondary} />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                    {selectedGenres.length === 0 && (
                        <View className="pt-2">
                            <Text color={CineMateColors.textSecondary} variant="caption">
                                Help us personalize your movie recommendations
                            </Text>
                        </View>
                    )}
                </View>

                {/* Update Profile Button */}
                <TouchableOpacity
                    onPress={handleUpdateProfile}
                    activeOpacity={0.8}
                    disabled={isLoading || !isFormValid}
                    style={{
                        backgroundColor: (isLoading || !isFormValid) ? CineMateColors.textSecondary : CineMateColors.primary,
                        paddingVertical: 16,
                        borderRadius: 12,
                        marginBottom: 24,
                        shadowColor: CineMateColors.primary,
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    accessible={true}
                    accessibilityLabel={isLoading ? "Updating profile" : "Update profile"}
                >
                    {isLoading && (
                        <ActivityIndicator
                            color="#FFFFFF"
                            size="small"
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <Text className="text-center" weight="semiBold" variant="h5" color="#FFFFFF">
                        {isLoading ? 'Updating Profile...' : 'Update Profile'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Genre Selection Modal */}
            <Modal
                visible={showGenreModal}
                animationType="slide"
                presentationStyle="formSheet"
                onRequestClose={() => setShowGenreModal(false)}
            >
                <View className="flex-1 bg-dark-bg">
                    <View className="flex-row items-center justify-between p-4 border-b border-alt-bg">
                        <TouchableOpacity
                            onPress={() => {
                                if (Platform.OS === 'ios') {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }
                                setShowGenreModal(false);
                            }}
                            accessible={true}
                            accessibilityLabel="Cancel genre selection"
                        >
                            <Text color={CineMateColors.primary} variant="body" weight="medium">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <Text color="#FFFFFF" variant="h6" weight="semiBold">
                            Select Genres
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                if (Platform.OS === 'ios') {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                }
                                setShowGenreModal(false);
                            }}
                            accessible={true}
                            accessibilityLabel={`Done, ${selectedGenres.length} genres selected`}
                        >
                            <Text color={CineMateColors.primary} variant="body" weight="semiBold">
                                Done ({selectedGenres.length})
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                        <Text color={CineMateColors.textSecondary} variant="body" className="mb-6 text-center">
                            Choose your favorite movie genres to get personalized recommendations
                        </Text>

                        {loadingGenres ? (
                            <View className="flex-1 items-center justify-center">
                                <ActivityIndicator size="large" color={CineMateColors.primary} />
                                <Text color={CineMateColors.textSecondary} variant="body" className="mt-4">
                                    Loading genres...
                                </Text>
                            </View>
                        ) : (
                            <View className="flex-row flex-wrap justify-between">
                                {genres.map((item) => {
                                    const isSelected = selectedGenres.includes(item.id);
                                    const genreColor = getGenreColor(item.name);

                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={{
                                                width: (screenWidth - 48) / 2 - 8,
                                                marginBottom: 16,
                                                backgroundColor: isSelected ? `${genreColor}20` : CineMateColors.altBg,
                                                borderRadius: 12,
                                                padding: 16,
                                                borderWidth: 2,
                                                borderColor: isSelected ? genreColor : 'transparent',
                                            }}
                                            onPress={() => toggleGenreSelection(item.id)}
                                            activeOpacity={0.8}
                                            accessible={true}
                                            accessibilityLabel={`${item.name} genre, ${isSelected ? 'selected' : 'not selected'}`}
                                            accessibilityRole="checkbox"
                                            accessibilityState={{ checked: isSelected }}
                                        >
                                            <View className="items-center">
                                                <View
                                                    className="w-12 h-12 rounded-full items-center justify-center mb-3"
                                                    style={{ backgroundColor: genreColor }}
                                                >
                                                    <Feather
                                                        name={getGenreIcon(item.name)}
                                                        size={24}
                                                        color="#FFFFFF"
                                                    />
                                                </View>
                                                <Text
                                                    variant="body"
                                                    weight={isSelected ? "semiBold" : "medium"}
                                                    color={isSelected ? genreColor : "#FFFFFF"}
                                                    className="text-center"
                                                    numberOfLines={2}
                                                >
                                                    {item.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}