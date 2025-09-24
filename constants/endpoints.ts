
export const BASE_URL = "https://api.cinemate.com"

export const endPoints = {
    auth: {
        refreshToken: `/auth/refresh-token`,
        login: `/auth/login`,
        signup: `/auth/signup`,
        logout: `/auth/logout`,
        forgotPassword: `/auth/forgot-password`,
        forgotPasswordVerify: `/auth/forgot-password/verify`,
        forgotPasswordChange: `/auth/forgot-password/change`,
    },
    movies: {
        search: `/movies/search`,
        popular: `/movies/popular`,
        comingSoon: `/movies/coming-soon`,
        recommendations: `/movies/recommendations`,
        details: (id: string | number) => `/movies/${id}`,
        favourites: `/movies/favourites`,
        genres: `/movies/genres`,
    },
    profile: {
        info: `/profile`,
        changePassword: `/profile/change-password`,
        notifications: `/profile/notifications`,
        readNotifications: `/profile/notifications/read`
    },
    system:{
        health: `/system/health`
    }
}