import { AppHeader } from "@/components/ui/app-header";
import { Text } from "@/components/ui/app-text";
import { CineMateColors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useState } from 'react';
import {
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        // Here you would typically handle authentication
        // For now, just navigate to the main app
        router.replace('/(app)/(tabs)');
    };

    return (
        <View
            className="flex-1 bg-dark-bg"
        >
            <AppHeader
                title="Sign In"
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
                            width: 80,
                            height: 80,
                        }}
                        source={require("@/assets/images/logo.png")}
                    />
                    <Text color="#FFFFFF" variant="h2" weight="bold" className="text-center mt-4">
                        Welcome Back
                    </Text>
                    <Text
                        color={CineMateColors.textSecondary}
                        variant="body"
                        weight="medium"
                        className="text-center mt-2"
                    >
                        Sign in to continue your movie journey
                    </Text>
                </View>

                {/* Form */}
                <View className="px-4 flex-1">
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
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            className="font-medium bg-alt-bg text-white text-base rounded-md px-4 py-5 border border-transparent"
                        />
                    </View>

                    {/* Password Input */}
                    <View className="mb-6">
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
                                autoComplete="password"
                                className="font-medium bg-alt-bg text-white text-base rounded-md px-4 py-5 border border-transparent"
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
                    </View>

                    {/* Forgot Password */}
                    <Link href="/auth/signin" className="mb-8">
                        <Text color={CineMateColors.primary} variant="body" className="text-right">
                            Forgot Password?
                        </Text>
                    </Link>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        onPress={handleSignIn}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: CineMateColors.primary,
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
                        }}
                    >
                        <Text className="text-center" weight="semiBold" variant="h5" color="#FFFFFF">
                            Sign In
                        </Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View className="items-center">
                        <Text variant="body" color={CineMateColors.textSecondary} className="text-center">
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/signup" className="text-primary font-semibold">
                                Sign Up
                            </Link>
                        </Text>
                    </View>
                </View>

                {/* Bottom spacing */}
                <View className="h-8" />
            </ScrollView>
        </View>
    );
}
