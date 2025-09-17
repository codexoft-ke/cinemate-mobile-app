import { Feather } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from "../ui/app-text";

const { width: screenWidth } = Dimensions.get('window');

interface SliderProps<T = any> {
    data: T[];
    renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement;
    autoplay?: boolean;
    loop?: boolean;
    pagination?: boolean;
    navigationButtons?: boolean;
    autoPlayInterval?: number;
    onSlideChange?: (index: number) => void;
    itemWidth?: number;
    itemSpacing?: number;
    height?: number;
    debug?: boolean;
}

export default function Slider<T = any>({ 
    data,
    renderItem,
    autoplay = true,
    loop = true,
    pagination = true,
    navigationButtons = false,
    autoPlayInterval = 4000,
    onSlideChange,
    itemWidth,
    itemSpacing = 16,
    height = 240,
    debug = false
}: SliderProps<T>) {
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoPlayEnabled, setAutoPlayEnabled] = useState(autoplay);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [isScrollViewReady, setIsScrollViewReady] = useState(false);
    const autoPlayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cardWidth = itemWidth || screenWidth - 32; // 16px margin on each side
    const cardSpacing = itemSpacing;

    if (debug) console.log('Slider initialized with:', { cardWidth, cardSpacing, screenWidth, dataLength: data.length });

    const clearTimers = useCallback(() => {
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
            autoPlayTimerRef.current = null;
        }
        if (resumeTimerRef.current) {
            clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = null;
        }
    }, []);

    const goToSlide = useCallback((index: number) => {
        if (debug) console.log('goToSlide called with index:', index, 'scrollViewRef.current:', !!scrollViewRef.current, 'data.length:', data.length);
        if (scrollViewRef.current && data.length > 0) {
            let targetIndex = index;
            
            // Handle looping
            if (loop) {
                if (index >= data.length) {
                    targetIndex = 0;
                } else if (index < 0) {
                    targetIndex = data.length - 1;
                }
            } else {
                targetIndex = Math.max(0, Math.min(index, data.length - 1));
            }
            
            const x = targetIndex * (cardWidth + cardSpacing);
            if (debug) console.log('goToSlide scrolling to:', { index, targetIndex, cardWidth, cardSpacing, x });
            scrollViewRef.current.scrollTo({ x, animated: true });
            setCurrentIndex(targetIndex);
            onSlideChange?.(targetIndex);
        } else {
            if (debug) console.log('goToSlide failed - scrollViewRef or data not available');
        }
    }, [cardWidth, cardSpacing, onSlideChange, data.length, loop, debug]);

    const handleScrollViewLayout = () => {
        if (debug) console.log('ScrollView layout complete, setting ready state');
        setIsScrollViewReady(true);
    };

    const startAutoPlay = useCallback(() => {
        if (!autoplay || data.length <= 1 || isUserInteracting || !scrollViewRef.current || !isScrollViewReady) {
            if (debug) console.log('AutoPlay not starting:', { autoplay, dataLength: data.length, isUserInteracting, hasScrollRef: !!scrollViewRef.current, isReady: isScrollViewReady });
            return;
        }
        
        clearTimers();
        if (debug) console.log('Starting autoplay...');
        
        autoPlayTimerRef.current = setInterval(() => {
            if (!isUserInteracting && scrollViewRef.current) {
                const nextIndex = loop ? (currentIndex + 1) % data.length : currentIndex + 1;
                
                if (!loop && nextIndex >= data.length) {
                    setAutoPlayEnabled(false);
                    if (debug) console.log('AutoPlay stopped - reached end');
                    return;
                }
                
                if (debug) console.log('AutoPlay moving to slide:', nextIndex);
                
                // Use requestAnimationFrame for better timing on mobile
                requestAnimationFrame(() => {
                    if (debug) console.log('About to call goToSlide with index:', nextIndex);
                    goToSlide(nextIndex);
                });
            }
        }, autoPlayInterval);
    }, [autoplay, data.length, loop, autoPlayInterval, goToSlide, isUserInteracting, clearTimers, debug, currentIndex, isScrollViewReady]);

    // Auto-play functionality - only handles cleanup
    useEffect(() => {
        if (debug) console.log('AutoPlay useEffect triggered:', { autoPlayEnabled, autoplay, dataLength: data.length, isUserInteracting });
        return clearTimers;
    }, [autoPlayEnabled, autoplay, data.length, clearTimers, debug, isUserInteracting]);

    // Debug user interaction changes
    useEffect(() => {
        if (debug) console.log('isUserInteracting changed to:', isUserInteracting);
    }, [isUserInteracting, debug]);

    // Start autoplay when ScrollView is ready
    useEffect(() => {
        if (autoPlayEnabled && autoplay && data.length > 1 && !isUserInteracting && isScrollViewReady) {
            if (debug) console.log('ScrollView is ready, starting autoplay...');
            startAutoPlay();
        }
    }, [autoPlayEnabled, autoplay, data.length, isUserInteracting, isScrollViewReady, startAutoPlay, debug]);

    // Handle app state changes
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'active' && autoPlayEnabled && autoplay) {
                startAutoPlay();
            } else {
                clearTimers();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [autoPlayEnabled, autoplay, startAutoPlay, clearTimers]);

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / (cardWidth + cardSpacing));
        if (index !== currentIndex && index >= 0 && index < data.length) {
            setCurrentIndex(index);
            onSlideChange?.(index);
        }
    };

    const handleTouchStart = () => {
        if (debug) console.log('User started touching slider');
        setIsUserInteracting(true);
        clearTimers();
    };

    const handleTouchEnd = () => {
        if (debug) console.log('User stopped touching slider - setting timer');
        // Clear any existing timer first
        if (resumeTimerRef.current) {
            clearTimeout(resumeTimerRef.current);
        }
        
        // Resume autoplay after user stops interacting
        if (autoplay && autoPlayEnabled) {
            resumeTimerRef.current = setTimeout(() => {
                if (debug) console.log('Timer expired - resuming autoplay');
                setIsUserInteracting(false);
            }, 1500);
        }
    };

    const handleMomentumScrollEnd = () => {
        if (debug) console.log('Scroll momentum ended - resuming autoplay directly');
        // Clear any pending timer
        if (resumeTimerRef.current) {
            clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = null;
        }
        // Resume autoplay immediately when momentum ends
        if (autoplay && autoPlayEnabled) {
            setIsUserInteracting(false);
        }
    };

    const goToPrevious = () => {
        const prevIndex = loop ? 
            (currentIndex > 0 ? currentIndex - 1 : data.length - 1) : 
            Math.max(0, currentIndex - 1);
        goToSlide(prevIndex);
    };

    const goToNext = () => {
        const nextIndex = loop ? 
            (currentIndex + 1) % data.length : 
            Math.min(data.length - 1, currentIndex + 1);
        goToSlide(nextIndex);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimers();
        };
    }, [clearTimers]);

    if (!data || data.length === 0) {
        return (
            <View style={{ height }} className="justify-center items-center">
                <Text className="text-gray-400">No items available</Text>
            </View>
        );
    }

    return (
        <View className="relative">
            {/* Slider */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                onLayout={handleScrollViewLayout}
                onScroll={handleScroll}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                scrollEventThrottle={16}
                snapToInterval={cardWidth + cardSpacing}
                decelerationRate="fast"
                bounces={false}
                bouncesZoom={false}
                alwaysBounceHorizontal={false}
                style={{ height }}
            >
                {data.map((item, index) => (
                    <View 
                        key={`slider-item-${index}`}
                        style={{ 
                            width: cardWidth, 
                            marginRight: index === data.length - 1 ? 0 : cardSpacing 
                        }}
                    >
                        {renderItem({ item, index })}
                    </View>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            {pagination && data.length > 1 && (
                <View className="flex-row justify-center items-center mt-4 space-x-2">
                    {data.map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => goToSlide(index)}
                            activeOpacity={0.7}
                        >
                            <View
                                className={`h-2 rounded-full transition-all duration-300 mx-0.5 ${
                                    index === currentIndex
                                        ? 'w-8 bg-primary'
                                        : 'w-2 bg-gray-600'
                                }`}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Navigation Arrows */}
            {navigationButtons && data.length > 1 && (
                <>
                    <TouchableOpacity
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full"
                        onPress={goToPrevious}
                        activeOpacity={0.7}
                        style={{ transform: [{ translateY: -16 }] }}
                    >
                        <Feather name="chevron-left" size={20} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full"
                        onPress={goToNext}
                        activeOpacity={0.7}
                        style={{ transform: [{ translateY: -16 }] }}
                    >
                        <Feather name="chevron-right" size={20} color="white" />
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}