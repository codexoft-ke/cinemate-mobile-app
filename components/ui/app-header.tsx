import { CineMateColors, Colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import { ReactElement } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Text } from "./app-text";

interface AppHeaderProps {
    title?: string;
    leftIcon?: ReactElement;
    rightIcon?: ReactElement;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    className?: string;
    backgroundColor?: string;
    titleColor?: string;
    iconColor?: string;
    showBorder?: boolean;
    transparent?: boolean;
}

export function AppHeader({
    title,
    leftIcon,
    rightIcon,
    showLeftIcon = true,
    showRightIcon = true,
    onLeftPress,
    onRightPress,
    className,
    backgroundColor = 'transparent',
    titleColor = CineMateColors.textPrimary,
    iconColor = CineMateColors.textPrimary,
    showBorder = false,
    transparent = false
}: AppHeaderProps) {
    const router = useRouter();

    const handleLeftPress = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        if (onLeftPress) {
            onLeftPress();
        } else {
            router.back();
        }
    };

    const handleRightPress = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        if (onRightPress) {
            onRightPress();
        } else {
            router.push("/profile/notifications");
        }
    };

    return (
        <View 
            style={{
                backgroundColor: transparent ? 'transparent' : backgroundColor || CineMateColors.darkBg,
                borderBottomWidth: showBorder ? 1 : 0,
                borderBottomColor: Colors.dark.border,
            }}
            className={`px-4 ${className}`}
        >
            <View className="flex-row justify-between items-center min-h-[60px]">
                {/* Left Section */}
                <View className="flex-1 justify-center">
                    {showLeftIcon && (
                        <TouchableOpacity
                            onPress={handleLeftPress}
                            activeOpacity={0.7}
                            style={{
                                width: 44,
                                height: 44,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 22,
                            }}
                            accessibilityLabel="Go back"
                            accessibilityRole="button"
                        >
                            {leftIcon || (
                                <Feather 
                                    name='arrow-left' 
                                    size={24} 
                                    color={iconColor}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                {/* Center Section */}
                <View className="flex-2 justify-center items-center">
                    {title && (
                        <Text 
                            color={titleColor}
                            variant='h5' 
                            weight='bold'
                            className="text-center"
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                    )}
                </View>

                {/* Right Section */}
                <View className="flex-1 justify-center items-end">
                    {showRightIcon && (
                        <TouchableOpacity
                            onPress={handleRightPress}
                            activeOpacity={0.7}
                            style={{
                                width: 44,
                                height: 44,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 22,
                            }}
                            accessibilityLabel="Notifications"
                            accessibilityRole="button"
                        >
                            {rightIcon || (
                                <Feather 
                                    name='bell' 
                                    size={24} 
                                    color={iconColor}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}