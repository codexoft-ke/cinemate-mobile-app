import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "./app-text";
import { ReactElement } from "react";
import { useRouter } from "expo-router";

interface AppHeaderProps {
    title: string,
    leftIcon?: ReactElement,
    rightIcon?: ReactElement,
}

export function AppHeader({
    title,
    leftIcon,
    rightIcon
}: AppHeaderProps) {
    const router = useRouter();
    return (
        <View className='flex-row justify-between items-center mx-4 my-4'>
            {leftIcon ?? (
                <Feather name='arrow-left' size={25} color="white" style={{ fontWeight: 'bold' }} onPress={() => router.back()} />
            )}
            {title && (
                <Text className='text-white' variant='h5' weight='bold' >{title}</Text>
            )}
            {rightIcon ?? (
                <Feather name='bell' size={25} color="white" style={{ fontWeight: 'bold' }} onPress={() => router.push("/profile/notifications")} />
            )}
        </View>
    )
}