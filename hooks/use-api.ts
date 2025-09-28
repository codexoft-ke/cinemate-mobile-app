import { endPoints } from '@/constants/endpoints';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig, isAxiosError } from 'axios';
import useSecureStore from './use-store';
import { useAuth } from '@/contexts/AuthContext';

//const BASE_URL = "http://192.168.134.51:8000";
//const BASE_URL = "http://10.42.0.1:8000";
//const BASE_URL = "http://localhost:8000";
const BASE_URL = "https://cinemate.codexoft.tech";

// Extend the AxiosRequestConfig to include _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

export interface ApiRequestConfig<T = unknown> {
    data?: T;
    params?: T;
    endpoint: string;
    errorMessage?: string;
}

export interface ApiError {
    success: false;
    message: string;
    data: Record<string, never>;
    error?: {
        code?: string;
        message?: string;
        details?: Record<string, string[]>;
    };
}

// Initialize axios instance with proper configuration
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'x-platform': 'MOBILE-APP',
    },
    timeout: 10000,
    withCredentials: true,
});

// Request interceptor to add auth token dynamically
axiosInstance.interceptors.request.use(
    async (config) => {
        if (typeof window !== 'undefined') {
            const token = await useSecureStore.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor with improved error handling
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('refresh-token')
        ) {
            originalRequest._retry = true;

            try {
                await apiRequest.post({
                    endpoint: endPoints.auth.refreshToken
                });
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Clear stored auth token on refresh failure but don't redirect automatically
                // Let the app's auth state management handle the navigation
                try {
                    
                    await useSecureStore.deleteItem('auth_token');
                    useAuth().logout();
                } catch (clearError) {
                    console.error('Error clearing auth token:', clearError);
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Generic error handler
const handleApiError = (error: unknown, fallbackMessage?: string): ApiError => {
    if (isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data;
        
        // Handle validation errors and structured error responses
        if (errorData.error) {
            const { code, message, details } = errorData.error;
            
            // If there are validation details, format them into a readable message
            let formattedMessage = message || "Validation failed";
            if (details && typeof details === 'object') {
                const validationMessages = Object.entries(details)
                    .map(([field, messages]) => {
                        if (Array.isArray(messages)) {
                            return `${field}: ${messages.join(', ')}`;
                        }
                        return `${field}: ${messages}`;
                    })
                    .join('; ');
                
                if (validationMessages) {
                    formattedMessage += ` - ${validationMessages}`;
                }
            }
            
            return {
                success: false,
                message: formattedMessage,
                data: {},
                error: {
                    code,
                    message,
                    details
                }
            };
        }
        
        // Handle simple error responses
        if (errorData.message) {
            return {
                success: false,
                message: errorData.message,
                data: {},
                error: errorData.error
            };
        }
    }

    return {
        success: false,
        message: fallbackMessage || "An error occurred",
        data: {}
    };
};

// Generic API request handler
const makeRequest = async <T = unknown>(
    method: 'get' | 'post' | 'put' | 'delete',
    config: ApiRequestConfig
): Promise<ApiResponse<T> | ApiError> => {
    try {
        let response: AxiosResponse;

        switch (method) {
            case 'post':
                response = await axiosInstance.post(config.endpoint, config.data, { params: config.params });
                break;
            case 'put':
                response = await axiosInstance.put(config.endpoint, config.data, { params: config.params });
                break;
            case 'delete':
                response = await axiosInstance.delete(config.endpoint, { params: config.params });
                break;
            default:
                response = await axiosInstance.get(config.endpoint, { params: config.params });
                break;
        }

        const { success, message, data, error } = response.data;

        // Handle success responses
        if (success !== false) {
            return {
                success: success ?? true,
                message: message || "Request completed successfully",
                data: data || {}
            };
        }
        
        // Handle error responses that come with 200 status but success: false
        return {
            success: false,
            message: message || error?.message || "Request failed",
            data: {},
            error: error
        };
    } catch (error) {
        console.log(error);
        return handleApiError(error, config.errorMessage);
    }
};

// Helper function to extract validation errors for form handling
export const getValidationErrors = (apiError: ApiError): Record<string, string[]> | null => {
    if (apiError.error?.details && typeof apiError.error.details === 'object') {
        return apiError.error.details;
    }
    return null;
};

// Helper function to get first validation error for a specific field
export const getFieldError = (apiError: ApiError, fieldName: string): string | null => {
    const validationErrors = getValidationErrors(apiError);
    if (validationErrors && validationErrors[fieldName] && validationErrors[fieldName].length > 0) {
        return validationErrors[fieldName][0];
    }
    return null;
};

export const apiRequest = {
    post: <T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T> | ApiError> =>
        makeRequest<T>('post', config),

    get: <T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T> | ApiError> =>
        makeRequest<T>('get', config),

    put: <T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T> | ApiError> =>
        makeRequest<T>('put', config),

    delete: <T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T> | ApiError> =>
        makeRequest<T>('delete', config),
};

export const useAuthentication = {
    login: async (credentials: { email: string; password: string }): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: endPoints.auth.login,
            data: credentials,
            errorMessage: "Login failed. Please check your credentials."
        });
    },

    logout: async (): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: endPoints.auth.logout,
            errorMessage: "Logout failed. Please try again."
        });
    },

    refreshToken: async (): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: endPoints.auth.refreshToken,
            errorMessage: "Token refresh failed."
        });
    },

    signup: async (details: { name: string; email: string; password: string; genres: string[] | number[] }): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: endPoints.auth.signup,
            data: details,
            errorMessage: "Signup failed. Please try again."
        });
    },

    forgotPassword: async (details: { email: string }): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: endPoints.auth.forgotPassword,
            data: details,
            errorMessage: "Password reset request failed. Please try again."
        });
    },

    forgotPasswordVerify: async (details: { otp_code: string | number }): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: endPoints.auth.forgotPasswordVerify,
            data: details,
            errorMessage: "Verification failed. Please try again."
        });
    },

    forgotPasswordChange: async (details: { password: string }): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: endPoints.auth.forgotPasswordChange,
            data: details,
            errorMessage: "Password change failed. Please try again."
        });
    },
};

export const useMovies = {
    search: async (params: { q: string; page?: number, limit?: number }): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.movies.search,
            params: params,
            errorMessage: "Movie search failed. Please try again."
        });
    },

    popular: async (params: { page: number, limit: number }): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.movies.popular,
            params: params,
            errorMessage: "Failed to fetch popular movies. Please try again."
        });
    },

    comingSoon: async (params: { page: number, limit: number }): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.movies.comingSoon,
            params: params,
            errorMessage: "Failed to fetch coming soon movies. Please try again."
        });
    },

    recommendations: async (params?: { page: number, limit: number }): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.movies.recommendations,
            params: params,
            errorMessage: "Failed to fetch movie recommendations. Please try again."
        });
    },

    details: async (id: string): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.movies.details(id),
            errorMessage: "Failed to fetch movie details. Please try again."
        });
    },

    addToFavourites: async (data: { movie_id: string | number }): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: endPoints.movies.favourites,
            data: data,
            errorMessage: "Failed to add movie to favourites. Please try again."
        });
    },

    removeFromFavourites: async (params: { movie_id: string | number }): Promise<ApiResponse | ApiError> => {
        return apiRequest.delete({
            endpoint: endPoints.movies.favourites,
            params: params,
            errorMessage: "Failed to remove movie from favourites. Please try again."
        });
    },

    favourites: async (params?: { page?: number; limit?: number }): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.movies.favourites,
            params: params,
            errorMessage: "Failed to fetch favourite movies. Please try again."
        });
    },

    genres: async (): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.movies.genres,
            errorMessage: "Failed to fetch movie genres. Please try again."
        });
    },
};

export const useProfile = {
    info: async (): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.profile.info,
            errorMessage: "Failed to fetch profile information. Please try again."
        });
    },

    updateInfo: async (details: { name: string; email: string, genres: string[] }): Promise<ApiResponse | ApiError> => {
        return apiRequest.put({
            endpoint: endPoints.profile.info,
            data: details,
            errorMessage: "Failed to update profile information. Please try again."
        });
    },

    changePassword: async (details: { old_password: string; new_password: string }): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: endPoints.profile.changePassword,
            data: details,
            errorMessage: "Failed to change password. Please try again."
        });
    },

    notifications: async (params: { page: number; limit: number; unread_only: boolean | number | string }): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.profile.notifications,
            params: params,
            errorMessage: "Failed to fetch notifications. Please try again."
        });
    },

    readNotifications: async (details: { notification_id: string | number | string[] | number[] }): Promise<ApiResponse | ApiError> => {
        return apiRequest.post({
            endpoint: `${endPoints.profile.notifications}/read`,
            data: details,
            errorMessage: "Failed to mark notifications as read. Please try again."
        });
    },
};

export const useSystem = {
    healthCheck: async (): Promise<ApiResponse | ApiError> => {
        return apiRequest.get({
            endpoint: endPoints.system.health,
            errorMessage: "System health check failed. Please try again."
        });
    },
};

export default axiosInstance;