import { Feather } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Text } from '@/components/ui/app-text';
import { CineMateColors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: CineMateColors.primary,
                tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                tabBarStyle: {
                    backgroundColor: colorScheme === 'dark' ? CineMateColors.altBg : Colors.light.background,
                    borderTopColor: colorScheme === 'dark' ? CineMateColors.altBg : Colors.light.border,
                    borderTopWidth: 1,
                    borderRadius: 100,
                    marginHorizontal: 15,
                    paddingHorizontal: 15,
                    marginBottom: 10,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 70,
                    position: 'absolute',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                headerShown: false,
                tabBarButton: HapticTab,
            }}>
            <Tabs.Screen
                name="index"
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/")
                    },
                })}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => <Feather size={24} name="home" color={color} />,
                    tabBarLabel: ({ focused }) => focused ? (
                        <Text numberOfLines={1} variant='caption' weight='bold' color={CineMateColors.primary}>Home</Text>
                    ) : null,
                }}
            />
            <Tabs.Screen
                name="search"
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/search")
                    },
                })}
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, focused }) => <Feather size={24} name="search" color={color} />,
                    tabBarLabel: ({ focused }) => focused ? (
                        <Text numberOfLines={1} variant='caption' weight='bold' color={CineMateColors.primary}>Search</Text>
                    ) : null,
                }}
            />
            <Tabs.Screen
                name="recommendation"
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/recommendation")
                    },
                })}
                options={{
                    title: 'For You',
                    tabBarIcon: ({ color, focused }) => <Feather size={24} name="star" color={color} />,
                    tabBarLabel: ({ focused }) => focused ? (
                        <Text numberOfLines={1} variant='caption' weight='bold' color={CineMateColors.primary}>For You</Text>
                    ) : null,
                }}
            />
            <Tabs.Screen
                name="favourites"
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/favourites")
                    },
                })}
                options={{
                    title: 'Favourites',
                    tabBarIcon: ({ color, focused }) => <Feather size={24} name="heart" color={color} />,
                    tabBarLabel: ({ focused }) => focused ? (
                        <Text numberOfLines={1} variant='caption' weight='bold' color={CineMateColors.primary}>Favourites</Text>
                    ) : null,
                }}
            />
            <Tabs.Screen
                name="profile"
                listeners={() => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/profile")
                    },
                })}
                options={{
                    title: 'Profile',

                    tabBarIcon: ({ color, focused }) => <Feather size={24} name="user" color={color} />,
                    tabBarLabel: ({ focused }) => focused ? (
                        <Text numberOfLines={1} variant='caption' weight='bold' color={CineMateColors.primary}>Profile</Text>
                    ) : null,
                }}
            />
        </Tabs>
    );
}
