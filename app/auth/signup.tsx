import { AppHeader } from "@/components/ui/app-header";
import { Text } from "@/components/ui/app-text";
import { CineMateColors } from "@/constants/theme";
import { ApiError, getFieldError, getValidationErrors, useAuthentication, useMovies } from "@/hooks/use-api";
import useStore from "@/hooks/use-store";
import { Feather } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
const { width: screenWidth } = Dimensions.get('window');

export default function SignUp() {

    interface Genre {
        id: string;
        name: string;
    }

    const genreColors: { [key: string]: string } = {
        'Action': CineMateColors.action,
        'Comedy': CineMateColors.comedy,
        'Drama': CineMateColors.drama,
        'Horror': CineMateColors.horror,
        'Romance': CineMateColors.romance,
        'Sci-Fi': CineMateColors.sciFi,
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
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Genre selection state
    const [genres, setGenres] = useState<Genre[]>([
        {
            "id": "28",
            "name": "Action"
        },
        {
            "id": "10759",
            "name": "Action & Adventure"
        },
        {
            "id": "12",
            "name": "Adventure"
        },
        {
            "id": "16",
            "name": "Animation"
        },
        {
            "id": "35",
            "name": "Comedy"
        },
        {
            "id": "80",
            "name": "Crime"
        },
        {
            "id": "99",
            "name": "Documentary"
        },
        {
            "id": "18",
            "name": "Drama"
        },
        {
            "id": "10751",
            "name": "Family"
        },
        {
            "id": "14",
            "name": "Fantasy"
        },
        {
            "id": "36",
            "name": "History"
        },
        {
            "id": "27",
            "name": "Horror"
        },
        {
            "id": "10762",
            "name": "Kids"
        },
        {
            "id": "10402",
            "name": "Music"
        },
        {
            "id": "9648",
            "name": "Mystery"
        },
        {
            "id": "10763",
            "name": "News"
        },
        {
            "id": "10764",
            "name": "Reality"
        },
        {
            "id": "10749",
            "name": "Romance"
        },
        {
            "id": "878",
            "name": "Science Fiction"
        },
        {
            "id": "10765",
            "name": "Sci-Fi & Fantasy"
        },
        {
            "id": "10766",
            "name": "Soap"
        },
        {
            "id": "10767",
            "name": "Talk"
        },
        {
            "id": "53",
            "name": "Thriller"
        },
        {
            "id": "10770",
            "name": "TV Movie"
        },
        {
            "id": "10752",
            "name": "War"
        },
        {
            "id": "10768",
            "name": "War & Politics"
        },
        {
            "id": "37",
            "name": "Western"
        }
    ]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
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
                setGenres(data.genres || []);
            }
        } catch (error) {
            console.error('Error fetching genres:', error);
            Alert.alert('Error', 'Failed to load genres. Please try again.');
        } finally {
            setLoadingGenres(false);
        }
    };

    const toggleGenreSelection = (genreId: string) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    const getGenreColor = (genreName: string): string => {
        return genreColors[genreName] || CineMateColors.primary;
    };

    const [inputErrors, setInputErrors] = useState({
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

    const clearInputErrors = () => {
        setInputErrors({
            name: { error: false, message: "" },
            email_address: { error: false, message: "" },
            password: { error: false, message: "" },
            c_password: { error: false, message: "" },
        });
    };

    const validateInputs = () => {
        const errors = {
            name: {
                error: !name || name.length < 2,
                message: !name ? "Name is required" : name.length < 2 ? "Name must be at least 2 characters" : ""
            },
            email: {
                error: !email || !/\S+@\S+\.\S+/.test(email),
                message: !email ? "Email is required" : !/\S+@\S+\.\S+/.test(email) ? "Please enter a valid email" : ""
            },
            email_address: {
                error: false,
                message: ""
            },
            password: {
                error: !password || password.length < 8,
                message: !password ? "Password is required" : password.length < 8 ? "Password must be at least 8 characters" : ""
            },
            c_password: {
                error: !confirmPassword || confirmPassword !== password,
                message: !confirmPassword ? "Please confirm your password" : confirmPassword !== password ? "Passwords don't match" : ""
            }
        };

        setInputErrors(errors);
        return !errors.name.error && !errors.email.error && !errors.email_address.error && !errors.password.error && !errors.c_password.error;
    };

    const handleSignUp = async () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        if (!validateInputs()) {
            return;
        }

        if (selectedGenres.length === 0) {
            Alert.alert(
                'Select Genres',
                'Please select at least one favorite genre to personalize your movie recommendations.',
                [{ text: 'OK', onPress: () => setShowGenreModal(true) }]
            );
            return;
        }

        setIsLoading(true);
        clearInputErrors(); // Clear any previous errors

        try {
            const response = await useAuthentication.signup({
                email,
                password,
                name,
                genres: selectedGenres
            });
            if (!response.success) {
                const errorResponse = response as ApiError;
                throw errorResponse;
            }
            // Store token and user data
            const { access_token, user: userData } = (response.data || {}) as { access_token: string; user: any };
            if (!access_token) {
                throw new Error('No access token received');
            }
            await useStore.setItem('auth_token', access_token);
            await useStore.setItem('user_data', JSON.stringify(userData));
            // Navigate to main app
            router.replace('/(app)/(tabs)');
        } catch (error: any) {
            // Check if it's a validation error (ApiError with validation details)
            if (error && !error.success && error.error?.details) {
                const validationErrors = getValidationErrors(error);

                // Handle non_field_errors as a general error alert
                if (validationErrors && validationErrors.non_field_errors && validationErrors.non_field_errors.length > 0) {
                    Alert.alert(
                        'Sign Up Failed',
                        validationErrors.non_field_errors.join('\n'),
                        [{ text: 'OK' }]
                    );
                    return;
                }

                if (validationErrors) {
                    // Update form errors with server validation
                    const updatedErrors = { ...inputErrors };

                    // Map server field names to form field names
                    const fieldMapping: { [key: string]: keyof typeof updatedErrors } = {
                        'email': 'email_address', // Django uses 'email', form uses 'email_address' for display
                        'name': 'name',
                        'password': 'password'
                    };

                    Object.keys(validationErrors).forEach(field => {
                        const formField = fieldMapping[field] || field as keyof typeof updatedErrors;
                        if (updatedErrors[formField]) {
                            const fieldError = getFieldError(error, field);
                            if (fieldError) {
                                updatedErrors[formField] = {
                                    error: true,
                                    message: fieldError
                                };
                            }
                        }
                    });
                    setInputErrors(updatedErrors);
                } else {
                    // Fallback to generic error
                    Alert.alert(
                        'Sign Up Failed',
                        error.message || 'Validation failed. Please check your inputs.',
                        [{ text: 'OK' }]
                    );
                }
            } else {
                // Show generic error alert for non-validation errors
                Alert.alert(
                    'Sign Up Failed',
                    error.message || 'An error occurred during sign up. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View
            className="flex-1 bg-dark-bg"
        >
            <AppHeader
                title="Sign Up"
                className="!bg-transparent !px-2"
                showRightIcon={false}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Header with logo */}
                <View className="items-center pt-2 pb-8">
                    <Image
                        style={{
                            width: 150,
                            height: 150,
                        }}
                        source={require("@/assets/images/logo.png")}
                    />
                    <Text color="#FFFFFF" variant="h2" weight="bold" className="text-center mt-4">
                        Create Account
                    </Text>
                    <Text
                        color={CineMateColors.textSecondary}
                        variant="body"
                        weight="medium"
                        className="text-center mt-2"
                    >
                        Join CineMate and discover amazing movies
                    </Text>
                </View>

                {/* Form */}
                <View className="px-4 flex-1">
                    {/* Name Input */}
                    <View className="mb-4">
                        <Text color="#FFFFFF" variant="body" weight="medium" className="mb-2">
                            Full Name
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
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
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={CineMateColors.textSecondary}
                            autoCapitalize="none"
                            autoComplete="email"
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

                    {/* Password Input */}
                    <View className="mb-4">
                        <Text color="#FFFFFF" variant="body" weight="medium" className="mb-2">
                            Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                placeholderTextColor={CineMateColors.textSecondary}
                                secureTextEntry={!showPassword}
                                autoComplete="new-password"
                                className={`font-medium bg-alt-bg text-white text-base rounded-md p-4 border ${inputErrors.password.error ? "border-red-600" : "border-transparent"} focus-visible:outline-none`}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    if (Platform.OS === 'ios') {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }
                                    setShowPassword(!showPassword);
                                }}
                                className="absolute right-4 top-3 p-1"
                                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                            >
                                <Feather
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color={CineMateColors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                        {inputErrors.password.error && (
                            <View className="pt-2">
                                <Text color="red" weight="semiBold">
                                    {inputErrors.password.message}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Confirm Password Input */}
                    <View className="mb-6">
                        <Text color="#FFFFFF" variant="body" weight="medium" className="mb-2">
                            Confirm Password
                        </Text>
                        <View className="relative">
                            <TextInput
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm your password"
                                placeholderTextColor={CineMateColors.textSecondary}
                                secureTextEntry={!showConfirmPassword}
                                autoComplete="new-password"
                                className={`font-medium bg-alt-bg text-white text-base rounded-md p-4 border ${inputErrors.c_password.error ? "border-red-600" : "border-transparent"} focus-visible:outline-none`}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    if (Platform.OS === 'ios') {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }
                                    setShowConfirmPassword(!showConfirmPassword);
                                }}
                                className="absolute right-4 top-3 p-1"
                                accessibilityLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                <Feather
                                    name={showConfirmPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color={CineMateColors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                        {inputErrors.c_password.error && (
                            <View className="pt-2">
                                <Text color="red" weight="semiBold">
                                    {inputErrors.c_password.message}
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

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        onPress={handleSignUp}
                        activeOpacity={0.8}
                        disabled={isLoading}
                        style={{
                            backgroundColor: isLoading ? CineMateColors.textSecondary : CineMateColors.primary,
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
                    >
                        {isLoading && (
                            <ActivityIndicator
                                color="#FFFFFF"
                                size="small"
                                style={{ marginRight: 8 }}
                            />
                        )}
                        <Text className="text-center" weight="semiBold" variant="h5" color="#FFFFFF">
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Text>
                    </TouchableOpacity>

                    {/* Sign In Link */}
                    <View className="items-center">
                        <Text variant="body" color={CineMateColors.textSecondary} className="text-center">
                            Already have an account?{' '}
                            <Link href="/auth/signin" className="text-primary font-semibold">
                                Sign In
                            </Link>
                        </Text>
                    </View>
                </View>

                {/* Bottom spacing */}
                <View className="h-8" />
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
                            disabled={selectedGenres.length === 0}
                            style={{ opacity: selectedGenres.length === 0 ? 0.5 : 1 }}
                        >
                            <Text color={CineMateColors.primary} variant="body" weight="semiBold">
                                Done ({selectedGenres.length})
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-4">
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

const getGenreIcon = (genreName: string): keyof typeof Feather.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Feather.glyphMap } = {
        'Action': 'zap',
        'Comedy': 'smile',
        'Drama': 'heart',
        'Horror': 'eye',
        'Romance': 'heart',
        'Sci-Fi': 'cpu',
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
    };

    return iconMap[genreName] || 'film';
};