import { Text } from "@/components/ui/app-text";
import { Shadows } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    icon: string;
    primaryColor: string;
    secondaryColor: string;
    image?: any;
}

export default function OnboardingScreen() {
    const [currentPage, setCurrentPage] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const onboardingSteps: OnboardingStep[] = [
        {
            id: 1,
            title: "Welcome to CineMate",
            description: "Your ultimate movie companion app. Discover, track, and enjoy movies like never before.",
            icon: "film",
            primaryColor: "#3b82f6",
            secondaryColor: "#1e40af",
            image: require('@/assets/images/logo.png')
        },
        {
            id: 2,
            title: "Discover Movies",
            description: "Browse through thousands of movies and find your next favorite film with our smart recommendations.",
            icon: "search",
            primaryColor: "#8b5cf6",
            secondaryColor: "#7c3aed"
        },
        {
            id: 3,
            title: "Track Your Watchlist",
            description: "Keep track of movies you want to watch and mark your favorites for easy access.",
            icon: "bookmark",
            primaryColor: "#10b981",
            secondaryColor: "#059669"
        },
        {
            id: 4,
            title: "Get Recommendations",
            description: "Receive personalized movie suggestions based on your preferences and viewing history.",
            icon: "heart",
            primaryColor: "#f59e0b",
            secondaryColor: "#d97706"
        }
    ];

    const onFinishOnboarding = async () => {
        try {
            await AsyncStorage.setItem('hasOnboarded', 'true');
            router.replace('/');
        } catch (error) {
            console.error('Error saving onboarding state:', error);
        }
    };

    const handleNext = () => {
        try {
            if (currentPage < onboardingSteps.length - 1) {
                const nextPage = currentPage + 1;
                setCurrentPage(nextPage);
                scrollViewRef.current?.scrollTo({ 
                    x: nextPage * screenWidth, 
                    animated: true 
                });
            } else {
                onFinishOnboarding();
            }
        } catch (error) {
            console.error('Error in handleNext:', error);
        }
    };

    const handleBack = () => {
        try {
            if (currentPage > 0) {
                const prevPage = currentPage - 1;
                setCurrentPage(prevPage);
                scrollViewRef.current?.scrollTo({ 
                    x: prevPage * screenWidth, 
                    animated: true 
                });
            }
        } catch (error) {
            console.error('Error in handleBack:', error);
        }
    };

    const handleSkip = () => {
        try {
            onFinishOnboarding();
        } catch (error) {
            console.error('Error in handleSkip:', error);
        }
    };

    return (
        <View className="flex-1 bg-dark-bg">
            {/* Skip Button - On the right side */}
            <View className="absolute top-6 right-6 z-10">
                <TouchableOpacity
                    onPress={handleSkip}
                    className="bg-alt-bg/80 px-4 py-2 rounded-full"
                    activeOpacity={0.8}
                    style={Shadows.small}
                >
                    <Text variant="caption" weight="medium" className="text-white">
                        Skip
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ScrollView for Onboarding Steps */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    try {
                        const newPage = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                        if (newPage >= 0 && newPage < onboardingSteps.length) {
                            setCurrentPage(newPage);
                        }
                    } catch (error) {
                        console.error('Error in onMomentumScrollEnd:', error);
                    }
                }}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {onboardingSteps.map((step, index) => (
                    <View key={step.id} style={{ width: screenWidth }}>
                        <OnboardingSlide
                            step={step}
                            isActive={currentPage === index}
                        />
                    </View>
                ))}
            </ScrollView>

            {/* Progress Dots - Moved below content with animation */}
            <View className="flex-row justify-center items-center py-10">
                {onboardingSteps.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            try {
                                if (index >= 0 && index < onboardingSteps.length) {
                                    setCurrentPage(index);
                                    scrollViewRef.current?.scrollTo({ 
                                        x: index * screenWidth, 
                                        animated: true 
                                    });
                                }
                            } catch (error) {
                                console.error('Error in dot navigation:', error);
                            }
                        }}
                        className={`mx-1 rounded-full transition-all duration-300 ${
                            currentPage === index ? 'w-8 h-3' : 'w-3 h-3'
                        }`}
                        style={{
                            backgroundColor: currentPage === index 
                                ? onboardingSteps[currentPage]?.primaryColor || '#3b82f6'
                                : '#4b5563',
                            opacity: currentPage === index ? 1 : 0.6
                        }}
                        activeOpacity={0.8}
                    />
                ))}
            </View>

            {/* Bottom Section */}
            <View className="px-6 pb-8 bg-dark-bg">
                {/* Navigation Buttons */}
                <View className="flex-row justify-between items-center">
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={handleBack}
                        className={`flex-row items-center px-4 py-2 rounded-full bg-alt-bg/60 ${
                            currentPage === 0 ? 'opacity-30' : 'opacity-100'
                        }`}
                        disabled={currentPage === 0}
                        activeOpacity={0.8}
                        style={currentPage > 0 ? Shadows.small : {}}
                    >
                        <Feather name="chevron-left" size={20} color="#ffffff" />
                        <Text variant="body" weight="medium" className="text-white ml-1">
                            Back
                        </Text>
                    </TouchableOpacity>

                    {/* Next/Get Started Button */}
                    <TouchableOpacity
                        onPress={handleNext}
                        className="flex-row items-center justify-center px-4 py-2 rounded-full"
                        style={{
                            backgroundColor: onboardingSteps[currentPage]?.primaryColor || '#3b82f6',
                            ...Shadows.medium
                        }}
                        activeOpacity={0.9}
                    >
                        <Text variant="body" weight="semiBold" className="text-white mr-2">
                            {currentPage === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                        </Text>
                        <Feather name="chevron-right" size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

interface OnboardingSlideProps {
    step: OnboardingStep;
    isActive: boolean;
}

const OnboardingSlide = ({ step, isActive }: OnboardingSlideProps) => {
    return (
        <View className="flex-1 justify-center items-center px-8">
            {/* Background Gradient */}
            <LinearGradient
                colors={[
                    'transparent',
                    `${step.primaryColor}20`,
                    `${step.secondaryColor}10`,
                    'transparent'
                ]}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            />

            {/* Content Container */}
            <Animatable.View 
                animation={isActive ? "fadeInUp" : undefined}
                duration={600}
                className="items-center max-w-sm"
            >
                {/* Icon/Image Container */}
                <Animatable.View
                    animation={isActive ? "bounceIn" : undefined}
                    delay={isActive ? 200 : 0}
                    duration={800}
                    className="items-center justify-center mb-12 rounded-full"
                    style={{
                        width: 200,
                        height: 200,
                        backgroundColor: `${step.primaryColor}20`,
                        ...Shadows.large
                    }}
                >
                    {step.image ? (
                        <Image
                            source={step.image}
                            style={{
                                width: 120,
                                height: 120,
                            }}
                            contentFit="contain"
                        />
                    ) : (
                        <View
                            className="items-center justify-center rounded-full"
                            style={{
                                width: 100,
                                height: 100,
                                backgroundColor: step.primaryColor,
                            }}
                        >
                            <Feather 
                                name={step.icon as any} 
                                size={50} 
                                color="#ffffff" 
                            />
                        </View>
                    )}
                </Animatable.View>

                {/* Title */}
                <Animatable.View
                    animation={isActive ? "fadeIn" : undefined}
                    delay={isActive ? 400 : 0}
                    duration={600}
                >
                    <Text
                        variant="h3"
                        weight="bold"
                        className="text-white text-center mb-6"
                        style={{ lineHeight: 36 }}
                    >
                        {step.title}
                    </Text>
                </Animatable.View>

                {/* Description */}
                <Animatable.View
                    animation={isActive ? "fadeIn" : undefined}
                    delay={isActive ? 600 : 0}
                    duration={600}
                >
                    <Text
                        variant="body"
                        weight="regular"
                        className="text-gray-300 mx-10 text-center leading-6"
                        style={{ lineHeight: 24 }}
                    >
                        {step.description}
                    </Text>
                </Animatable.View>
            </Animatable.View>
        </View>
    );
};