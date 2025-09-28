import { AppHeader } from '@/components/ui/app-header';
import { Text } from '@/components/ui/app-text';
import { CineMateColors } from '@/constants/theme';
import { useAuth, User } from '@/contexts/AuthContext';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

export default function ProfileScreen() {

    const router = useRouter();
    const toast = useToast();

    const { user: fetchUserInfo, logout } = useAuth();
    const [userInfo, setUserInfo] = useState<User>();

    interface MenuItems {
        id: string | number
        icon: typeof Feather.defaultProps | string
        type: string
        title: string
        route: string
    }

    const menuItems: MenuItems[] = [
        {
            id: 1,
            icon: 'user',
            type: 'route',
            title: 'Update Profile',
            route: 'profile/update-profile',
        },
        {
            id: 2,
            icon: 'lock',
            type: 'link',
            title: 'Change Password',
            route: 'change-password',
        },
        {
            id: 3,
            icon: 'send',
            type: 'link',
            title: 'Send Feedback',
            route: 'mailto:info@codexoft.tech?subject=CineMate App Feedback',
        },
        {
            id: 4,
            icon: 'info',
            type: 'route',
            title: 'About App',
            route: 'about-app',
        },
        {
            id: 5,
            icon: 'star',
            type: 'link',
            title: 'Rate Us',
            route: 'https://play.google.com/package?com.cinemate.android',
        }
    ];

    const logOut = async () => {
        const loadingToast = toast.show("Logging Out. Please wait!!!", {
            type: "normal",
            duration: 0
        })
        try {
            await logout();
        } catch (error) {
            console.log(error)
        } finally {
            toast.hide(loadingToast)
        }
    }

    useEffect(() => {
        console.log(fetchUserInfo);
            setUserInfo(fetchUserInfo as User);
    }, [fetchUserInfo])

    return (
        <View className='flex-1 bg-dark-bg'>
            <AppHeader title='Profile' />

            <ScrollView
                className='flex-1 px-4'
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View className='flex-column justify-center items-center mt-10'>
                    <Image
                        source={require("@/assets/images/icon.png")}
                        style={{ height: 120, width: 120, borderRadius: 100, borderWidth: 3, borderColor: CineMateColors.primary }}
                    />
                    <Text className='text-white pt-5' variant='h4' weight='bold'>{userInfo?.user?.name || "CineMate"}</Text>
                    <Text className='text-gray-400' variant='caption' weight='medium' >{userInfo?.user?.email}</Text>
                </View>

                {/* Menu Items */}
                <View className="mt-8">
                    {menuItems.map((item, index) => {
                        const onPress = () => {
                            switch (item.type) {
                                case "link":
                                    Linking.openURL(item.route)
                                    break;

                                case "route":
                                    router.push(item.route as any)
                                    break;

                                default:
                                    break;
                            }
                        }
                        return (
                            <TouchableOpacity key={index} className='py-5 flex-row justify-between items-center' onPress={onPress} >
                                <Feather className='flex-shrink-0' name={item.icon} size={24} color="white" style={{ fontWeight: 'bold' }} />
                                <Text className='text-white flex-shrink w-full text-start ml-5' variant='h6' weight='semiBold'>{item.title}</Text>
                                <Feather className='flex-shrink-0' name='chevron-right' size={24} color="white" style={{ fontWeight: 'bold' }} />
                            </TouchableOpacity>
                        )
                    })}
                </View>

                {/* Sign Out */}
                <TouchableOpacity onPress={logOut} className='bg-red-600 w-full text-center rounded-full mt-5'>
                    <Text className='text-center text-white py-4' weight='semiBold' >Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}