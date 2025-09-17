export interface Movie {
    id: number;
    title?: string;
    poster?: string;
    backdrop?: string;
    releaseDate?: string;
    genre?: string | number;
    rating?: number;
    duration?: number | string;
    director?: string;
    cast?: string[];
    synopsis?: string;

    // Boolean Values
    isFavorite?: boolean;
    isWatchlisted?: boolean;
    isTrending?: boolean;
    isRecommended?: boolean;

    [key: string]: any | string[] | number | undefined;
}