import { Text } from "@/components/ui/app-text";
import { CineMateColors } from "@/constants/theme";
import * as Haptics from 'expo-haptics';
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { Dimensions, Platform, ScrollView, TouchableOpacity, View } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function GetStarted() {
    const handleSignIn = () => {
        // Provide haptic feedback
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        // Navigate to sign in screen
        router.push('/auth/signin');
    };

    return (
        <ScrollView
            className="flex-1 bg-dark-bg"
            showsVerticalScrollIndicator={false}
            scrollEnabled
        >

            {/* Image Backdrop */}
            <View className='relative'>
                <Image
                    source={require("@/assets/images/backdrop.jpg")}
                    style={{
                        width: "100%",
                        height: screenWidth * 1.2,
                        alignSelf: 'center'
                    }}
                    contentPosition={"center"}
                    contentFit='cover'
                    cachePolicy="memory-disk"
                    priority="high"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(11, 24, 38, 0.8)', CineMateColors.darkBg]}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                    }}
                />
            </View>

            {/* Content Section */}
            <View className='px-6 -mt-52 relative z-10 flex-column items-center'>
                {/* Logo */}
                <View className="mb-8">
                    <Image
                        style={{
                            width: 120,
                            height: 120,
                        }}
                        source={require("@/assets/images/logo.png")}
                    />
                </View>

                {/* Title and Subtitle */}
                <View className="mb-8">
                    <Text color="#FFFFFF" variant="h1" weight="bold" className="text-center mb-2">
                        Get Started
                    </Text>
                    <Text
                        color={CineMateColors.textSecondary}
                        variant="h6"
                        weight="medium"
                        className="text-center px-4"
                    >
                        Your personal movie companion for endless entertainment
                    </Text>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                    onPress={handleSignIn}
                    activeOpacity={0.8}
                    style={{
                        backgroundColor: CineMateColors.primary,
                        paddingVertical: 16,
                        paddingHorizontal: 80,
                        borderRadius: 30,
                        marginVertical: 24,
                        shadowColor: CineMateColors.primary,
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <Text className="text-center" weight="semiBold" variant="h4" color="#FFFFFF">
                        Sign In
                    </Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View className="mb-6">
                    <Text variant="h6" color="#FFFFFF" className="text-center">
                        Don&apos;t have an account yet?{' '}
                        <Link href="/auth/signup" className="text-primary font-semibold">
                            Sign Up
                        </Link>
                    </Text>
                </View>

                {/* Terms and Privacy */}
                <View className="px-4">
                    <Text variant="caption" color={CineMateColors.textSecondary} className="text-center leading-5">
                        By creating an account or signing in you agree to CineMate{' '}
                        <Link href="/" className="text-primary">
                            Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link href="/" className="text-primary">
                            Privacy Policy
                        </Link>
                    </Text>
                </View>
            </View>

        </ScrollView>
    )
}