import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { ApiError, ApiResponse, useAuthentication, useProfile } from '../hooks/use-api';
import useStore from '../hooks/use-store';

// Types
export interface User {
    id: string;
    email: string;
    name?: string;
    genres?: string[] | number[];
    maturity_filter?: string;
    preferred_language?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials {
    email: string;
    password: string;
    name: string;
    genres: string[] | number[];
}

export interface AuthContextType {
    // State
    user: User | null;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    isLoading: boolean;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (credentials: SignUpCredentials) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    verifyPasswordReset: (otpCode: string | number) => Promise<void>;
    changePasswordWithReset: (password: string) => Promise<void>;
    updateProfile: (userData: { name: string; email: string; genres: string[] }) => Promise<void>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

// Constants
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Store access token securely
    const storeToken = async (token: string): Promise<void> => {
        try {
            await useStore.setItem(TOKEN_KEY, token);
        } catch (error) {
            console.error('Error storing token:', error);
            throw new Error('Failed to store authentication token');
        }
    };

    // Store user data
    const storeUserData = async (userData: User): Promise<void> => {
        try {
            await useStore.setItem(USER_KEY, JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Error storing user data:', error);
        }
    };

    // Clear stored data
    const clearStoredData = async (): Promise<void> => {
        try {
            await Promise.all([
                useStore.deleteItem(TOKEN_KEY),
                useStore.deleteItem(USER_KEY),
            ]);
        } catch (error) {
            console.error('Error clearing stored data:', error);
        }
    };

    // Login function
    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await useAuthentication.login(credentials);

            if (!response.success) {
                const errorResponse = response as ApiError;
                setIsAuthenticated(false); // Ensure user is not authenticated on error
                throw errorResponse;
            }

            // Extract token and user data from response
            const successResponse = response as ApiResponse<any>;
            const { access_token, user: userData } = successResponse.data;

            if (!access_token) {
                setIsAuthenticated(false);
                throw new Error('No access token received');
            }

            await storeToken(access_token);
            await storeUserData(userData);

            setIsAuthenticated(true);

            // Navigate to main app
            router.replace('/(app)/(tabs)');
        } catch (error: any) {
            setIsAuthenticated(false); // Always set to false on error
            console.error('Login error:', error);
            //throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Signup function
    const signup = async (credentials: SignUpCredentials): Promise<void> => {
        try {
            setIsLoading(true);

            const response = await useAuthentication.signup(credentials);

            console.log(response)

            if (!response.success) {
                const errorResponse = response as ApiError;
                // Don't show alert here - let the component handle error display
                // Just throw the original error response to preserve validation details
                throw errorResponse;
            }

            // Extract token and user data from response
            const successResponse = response as ApiResponse<any>;
            const { auth_token, user: userData } = successResponse.data;

            if (!auth_token) {
                throw new Error('No auth token received');
            }

            await storeToken(auth_token);
            await storeUserData(userData);

            setIsAuthenticated(true);

            // Navigate to main app
            router.replace('/(app)/(tabs)');
        } catch (error: any) {
            console.error('Signup error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true);

            // Try to logout on server (optional - don't fail if it doesn't work)
            try {
                await useAuthentication.logout();
            } catch {
                console.log('Server logout failed, continuing with local logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local data and update state
            await clearStoredData();
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);

            // Navigate to auth screen
            router.replace('/auth/signin');
        }
    };

    // Forgot password function
    const forgotPassword = async (email: string): Promise<void> => {
        try {
            const response = await useAuthentication.forgotPassword({ email });

            if (!response.success) {
                const errorResponse = response as ApiError;
                Alert.alert('Error', errorResponse.message);
                throw new Error(errorResponse.message);
            }

            Alert.alert('Success', 'Password reset instructions have been sent to your email.');
        } catch (error: any) {
            console.error('Forgot password error:', error);
            throw error;
        }
    };

    // Verify password reset function
    const verifyPasswordReset = async (otpCode: string | number): Promise<void> => {
        try {
            const response = await useAuthentication.forgotPasswordVerify({ otp_code: otpCode });

            if (!response.success) {
                const errorResponse = response as ApiError;
                Alert.alert('Error', errorResponse.message);
                throw new Error(errorResponse.message);
            }

            Alert.alert('Success', 'OTP verified successfully. You can now change your password.');
        } catch (error: any) {
            console.error('Verify password reset error:', error);
            throw error;
        }
    };

    // Change password with reset function
    const changePasswordWithReset = async (password: string): Promise<void> => {
        try {
            const response = await useAuthentication.forgotPasswordChange({ password });

            if (!response.success) {
                const errorResponse = response as ApiError;
                Alert.alert('Error', errorResponse.message);
                throw new Error(errorResponse.message);
            }

            Alert.alert('Success', 'Password has been reset successfully.');
            router.replace('/auth/signin');
        } catch (error: any) {
            console.error('Change password with reset error:', error);
            throw error;
        }
    };

    // Update profile function
    const updateProfile = async (userData: { name: string; email: string, genres: string[] }): Promise<void> => {
        try {
            const response = await useProfile.updateInfo(userData);

            if (!response.success) {
                const errorResponse = response as ApiError;
                Alert.alert('Error', errorResponse.message);
                throw new Error(errorResponse.message);
            }

            const successResponse = response as ApiResponse<User>;
            const updatedUser = successResponse.data;
            await storeUserData(updatedUser);
            Alert.alert('Success', 'Profile updated successfully.');
        } catch (error: any) {
            console.error('Update profile error:', error);
            throw error;
        }
    };

    // Change password function
    const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
        try {
            const response = await useProfile.changePassword({
                old_password: oldPassword,
                new_password: newPassword,
            });

            if (!response.success) {
                const errorResponse = response as ApiError;
                Alert.alert('Error', errorResponse.message);
                throw new Error(errorResponse.message);
            }

            Alert.alert('Success', 'Password changed successfully.');
        } catch (error: any) {
            console.error('Change password error:', error);
            throw error;
        }
    };

    // Fetch user profile from server
    const fetchUserProfile = async (): Promise<User | null> => {
        try {
            const response = await useProfile.info();

            if (response.success) {
                const successResponse = response as ApiResponse<{ user: User }>;
                return successResponse.data.user;
            }

            return null;
        } catch (error) {
            console.error('Fetch user profile error:', error);
            return null;
        }
    };

    // Initialize auth state on app start
    const initializeAuth = async (): Promise<void> => {
        try {
            setIsLoading(true);

            const [token, userDataString] = await Promise.all([
                useStore.getItem(TOKEN_KEY),
                useStore.getItem(USER_KEY),
            ]);

            if (token && userDataString) {
                // Try to fetch fresh user data from server to ensure token is still valid
                const freshUserData = await fetchUserProfile();

                if (freshUserData) {
                    // Token is valid and we got fresh user data
                    await storeUserData(freshUserData);
                    setIsAuthenticated(true);
                } else {
                    // Token might be expired or invalid, use stored data but don't set as authenticated
                    const storedUserData = JSON.parse(userDataString);
                    setUser(storedUserData);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            await clearStoredData();
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize on component mount
    useEffect(() => {
        initializeAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Context value
    const contextValue: AuthContextType = {
        user,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        forgotPassword,
        verifyPasswordReset,
        changePasswordWithReset,
        updateProfile,
        changePassword,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
