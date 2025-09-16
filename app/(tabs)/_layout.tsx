import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle:{
                    borderRadius: 50,
                    marginBottom: 10,
                }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Feather size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <Feather size={28} name="search" color={color} />,
                }}
            />
            <Tabs.Screen
                name="recommendation"
                options={{
                    title: 'For You',
                    tabBarIcon: ({ color }) => <Feather size={28} name="star" color={color} />,
                }}
            />
            <Tabs.Screen
                name="favourites"
                options={{
                    title: 'Favourites',
                    tabBarIcon: ({ color }) => <Feather size={28} name="heart" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Feather size={28} name="user" color={color} />,
                }}
            />
        </Tabs>
    );
}
