export interface Movie {
    id: number;
    title?: string;
    poster?: string;
    backdrop?: string;
    release_date?: string;
    genre?: string | number | string[] | number[];
    rating?: number;
    duration?: number | string;
    director?: string;
    cast?: string[];
    synopsis?: string;

    // Boolean Values
    is_favorite?: boolean;
    is_watchlisted?: boolean;
    is_trending?: boolean;
    is_recommended?: boolean;
    is_series?: boolean;

    [key: string]: any | string[] | number | undefined;
}

export interface EpisodeInfo {
    id: string | number
    name: string
    overview: string
    air_date: string
    episode_number: string | number
    runtime: string | number
    season_number: string | number
    still_path: string
    vote_average: string | number
}

export interface VideoInfo {
    id: string | number
    title?: string | null
    thumbnail?: string | null
    duration?: string | number | null
    views?: number | string | null
    key?: string | number | null
    type?: string | null
    official?: boolean | null
    published_at?: string | number | null
}

export interface CastInfo {
    id: number | string;
    name?: string | null;
    profile_path?: string | null;
    character?: string | null;
}

export interface ReviewInfo {
    id: string | number;
    author?: string | null;
    avatar?: string | null;
    rating?: number | null;
    content?: string | null;
    created_at?: string | null;
}