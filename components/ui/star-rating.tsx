import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Text } from './app-text';

interface StarRatingProps {
    rating: number; // Rating value between 0 and 5
    maxRating?: number; // Maximum rating value, default is 5
    starSize?: number; // Size of each star icon
    starColor?: string; // Color of the star icons
    emptyStarColor?: string; // Color of empty stars
    labelConfig?: {
        show: boolean; // Whether to show numeric labels next to stars
        color?: string; // Color of the label text
        position?: 'start' | 'end'; // Position of the label relative to star
        showMax?: boolean; // Whether to show the max rating in the label
    }
    className?: string; // Additional styling classes
}

const StarRating = ({
    rating,
    maxRating = 5,
    starSize = 24,
    starColor = "#fbbf24",
    emptyStarColor = "#6b7280",
    labelConfig,
    className = ""
}: StarRatingProps) => {
    // Ensure rating is within bounds
    const clampedRating = Math.max(0, Math.min(rating, maxRating));
    
    // Ensure labelConfig has proper defaults
    const config = {
        show: false,
        position: 'end' as const,
        color: '#fbbf24',
        showMax: false,
        ...labelConfig
    };

    // Generate array of star states
    const stars = Array.from({ length: maxRating }, (_, index) => {
        const starNumber = index + 1;

        if (clampedRating >= starNumber) {
            return 'full'; // Full star
        } else if (clampedRating >= starNumber - 0.5) {
            return 'half'; // Half star (if rating is X.5)
        } else {
            return 'empty'; // Empty star
        }
    });

    const renderStar = (starType: string, index: number) => {
        let iconName: keyof typeof Ionicons.glyphMap;
        let color: string;

        switch (starType) {
            case 'full':
                iconName = 'star';
                color = starColor;
                break;
            case 'half':
                iconName = 'star';
                color = starColor;
                break;
            case 'empty':
            default:
                iconName = 'star';
                color = emptyStarColor;
                break;
        }

        return (
            <View key={index} className="relative">
                {starType === 'half' ? (
                    <>
                        {/* Empty star as background */}
                        <Ionicons
                            name="star"
                            size={starSize}
                            color={emptyStarColor}
                        />
                        {/* Half filled star overlay */}
                        <View
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: starSize / 2,
                                overflow: 'hidden'
                            }}
                        >
                            <Ionicons
                                name="star"
                                size={starSize}
                                color={starColor}
                            />
                        </View>
                    </>
                ) : (
                    <Ionicons
                        name={iconName}
                        size={starSize}
                        color={color}
                    />
                )}
            </View>
        );
    };

    const renderLabel = () => (
        <Text
            weight="medium"
            color={config.color || '#fbbf24'}
            className="text-yellow-400"
            style={{ fontSize: Math.max(starSize*1.1, 12), lineHeight: Math.max(starSize*1.1, 12) }}
        >
            {clampedRating.toFixed(1)} {config.showMax && `/ ${maxRating}`}
        </Text>
    );

    return (
        <View className={`flex-row items-center ${className}`}>
            {config.show && config.position === 'start' && (
                <View className="mr-2 justify-center">
                    {renderLabel()}
                </View>
            )}

            <View className="flex-row items-center">
                {stars.map((starType, index) => renderStar(starType, index))}
            </View>

            {config.show && config.position === 'end' && (
                <View className="ml-2 justify-center">
                    {renderLabel()}
                </View>
            )}
        </View>
    );
};

export default StarRating;