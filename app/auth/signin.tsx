import { AppHeader } from "@/components/ui/app-header";
import { Text } from "@/components/ui/app-text";
import { CineMateColors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, getFieldError, getValidationErrors, useAuthentication } from "@/hooks/use-api";
import useStore from "@/hooks/use-store";
import { Feather } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Image } from "expo-image";
import { Link, router } from "expo-router"; // keep only this import
import { useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useToast } from "react-native-toast-notifications";

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { setIsAuthenticated } = useAuth();
    const toast = useToast();

    const [inputErrors, setInputErrors] = useState({
        email: {
            error: false,
            message: ""
        },
        password: {
            error: false,
            message: ""
        }
    });

    const clearInputErrors = () => {
        setInputErrors({
            email: { error: false, message: "" },
            password: { error: false, message: "" },
        });
    };

    const validateInputs = () => {
        const errors = {
            email: {
                error: !email || !/\S+@\S+\.\S+/.test(email),
                message: !email ? "Email is required" : !/\S+@\S+\.\S+/.test(email) ? "Please enter a valid email" : ""
            },
            password: {
                error: !password,
                message: !password ? "Password is required" : ""
            }
        };

        setInputErrors(errors);
        return !errors.email.error && !errors.password.error;
    };

    const handleSignIn = async () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        clearInputErrors(); // Clear any previous errors

        try {
            const response = await useAuthentication.login({ email, password });
            console.log("Login Response:", JSON.stringify(response));
            if (!response.success) {
                const errorResponse = response as ApiError;
                throw errorResponse;
            }
            // Store token and user data
            const { auth_token, user: userData } = (response.data || {}) as { auth_token: string; user: any };
            if (!auth_token) {
                throw new Error('No auth token received');
            }
            await useStore.setItem('auth_token', auth_token);
            await useStore.setItem('user_data', JSON.stringify(userData));
            setIsAuthenticated(true);
            // Navigate to main app
            router.replace('/(app)/(tabs)');
        } catch (error: any) {
            // Check if it's a validation error (ApiError with validation details)
            if (error && !error.success && error.error?.details) {
                const validationErrors = getValidationErrors(error);

                // Handle non_field_errors as a general error alert
                if (validationErrors && validationErrors.non_field_errors && validationErrors.non_field_errors.length > 0) {
                    toast.show(validationErrors.non_field_errors.join('\n'),{
                        type: 'danger',
                        placement: 'top',
                        duration: 4000,
                        animationType: 'slide-in',
                    })
                    return;
                }

                if (validationErrors) {
                    // Update form errors with server validation
                    const updatedErrors = { ...inputErrors };

                    // Map server field names to form field names
                    const fieldMapping: { [key: string]: keyof typeof updatedErrors } = {
                        'email': 'email',
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
                    toast.show(error.message || 'Validation failed. Please check your inputs.',{
                        type: 'danger',
                        placement: 'top',
                        duration: 4000,
                        animationType: 'slide-in',
                    })
                }
            } else {
                toast.show(error.message || 'An error occurred during sign in. Please try again.',{
                    type: 'danger',
                    placement: 'top',
                    duration: 4000,
                    animationType: 'slide-in',
                })
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
                            width: 150,
                            height: 150,
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
                            className={`font-medium bg-alt-bg text-white text-base rounded-md px-4 py-5 border ${inputErrors.email.error ? "border-red-600" : "border-transparent"} focus-visible:outline-none`}
                        />
                        {inputErrors.email.error && (
                            <View className="pt-2">
                                <Text color="red" weight="semiBold">
                                    {inputErrors.email.message}
                                </Text>
                            </View>
                        )}
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
                                className={`font-medium bg-alt-bg text-white text-base rounded-md px-4 py-5 border ${inputErrors.password.error ? "border-red-600" : "border-transparent"} focus-visible:outline-none`}
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
                            {isLoading ? 'Signing In...' : 'Sign In'}
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
