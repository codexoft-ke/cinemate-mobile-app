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

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignUp = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        // Here you would typically handle registration
        // For now, just navigate to the main app
        router.replace('/(app)/(tabs)');
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
                            width: 80,
                            height: 80,
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
                            className="font-medium bg-alt-bg text-white text-base rounded-md p-4 border border-transparent"
                        />
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
                            className="font-medium bg-alt-bg text-white text-base rounded-md p-4 border border-transparent"
                        />
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
                                className="font-medium bg-alt-bg text-white text-base rounded-md p-4 border border-transparent"
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
                                className="font-medium bg-alt-bg text-white text-base rounded-md p-4 border border-transparent"
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
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        onPress={handleSignUp}
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
                            Create Account
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
        </View>
    );
}