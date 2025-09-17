import { Movie } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from "react";
import { Dimensions, TouchableOpacity, View } from "react-native";
import { Text } from "../ui/app-text";

const { width: screenWidth } = Dimensions.get('window');

interface MovieCardProps {
    data: Movie;
    orientation?: 'vertical' | 'horizontal';
    showDetails?: boolean;
    onFavoritePress?: () => void;
    onPress?: () => void;
    style?: any;
}

const MovieCard = memo(function MovieCard({
    data,
    orientation = 'vertical',
    showDetails = true,
    onFavoritePress,
    onPress,
    style
}: MovieCardProps) {
    const movieImage = () => {
        if (orientation === 'vertical') {
            return data.poster;
        } else {
            return data.backdrop || data.poster;
        }
    }

    // Dynamic sizing based on orientation and screen size
    const cardDimensions = orientation === 'horizontal'
        ? {
            width: screenWidth * 0.85,
            height: screenWidth * 0.5,
            aspectRatio: 16 / 9
        }
        : {
            flex: 1,
            aspectRatio: 2 / 3,
            minHeight: 200,
            maxHeight: 300
        };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[{ marginBottom: 16 }, style]}
        >
            <View
                className="relative overflow-hidden rounded-xl bg-gray-800"
                style={[
                    cardDimensions,
                    {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 6,
                        elevation: 8,
                    }
                ]}
            >
                <Image
                    source={{ uri: movieImage() }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    transition={300}
                    placeholder="https://via.placeholder.com/300x450/1a1a1a/666666?text=Loading..."
                />

                {/* Gradient overlay for better text readability */}
                {showDetails && (
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.85)']}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '80%',
                        }}
                    />
                )}

                {/* Favorite button */}
                <TouchableOpacity
                    className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-2.5 rounded-full"
                    onPress={onFavoritePress}
                    activeOpacity={0.7}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <Ionicons
                        name={data.isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={data.isFavorite ? "#ef4444" : "white"}
                    />
                </TouchableOpacity>

                {/* Movie details overlay */}
                {showDetails && (
                    <View className="absolute bottom-0 left-0 right-0 p-4">
                        <Text
                            variant="caption"
                            className="text-white font-semibold mb-2"
                            numberOfLines={2}
                            weight="semiBold"
                        >
                            {data.title}
                        </Text>

                        {data.subTitle && (
                            <Text
                                variant="caption"
                                className="text-gray-300 font-semibold "
                                numberOfLines={2}
                                weight="semiBold"
                            >
                                On: {data.subTitle}
                            </Text>
                        )}

                        {/* Rating and year row */}
                        <View className="flex-row items-center mb-1">
                            {data.rating && (
                                <View className="flex-row items-center">
                                    <Feather name="star" size={12} color="#fbbf24" />
                                    <Text variant="caption" weight="medium" className="text-yellow-400 ml-1 font-medium">
                                        {data.rating.toFixed(1)}
                                    </Text>
                                    <Text className="text-gray-400 text-xs mx-1">•</Text>
                                </View>
                            )}
                            <Text className="text-gray-300" variant="caption" weight="medium">
                                {data.releaseDate ? new Date(data.releaseDate).getFullYear() : 'N/A'}
                            </Text>
                            {data.duration && (
                                <>
                                    <Text className="text-gray-400 text-xs mx-1">•</Text>
                                    <Text className="text-gray-400 text-xs" variant="caption" weight="regular">
                                        {data.duration}m
                                    </Text>
                                </>
                            )}
                        </View>

                        {/* Genre and duration row */}
                        <View className="flex-row items-center">
                            {data.genre && (
                                <Text className="text-gray-400 text-xs mr-2" variant="caption" weight="regular">
                                    {data.genre}
                                </Text>
                            )}
                        </View>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
});

export default MovieCard;
