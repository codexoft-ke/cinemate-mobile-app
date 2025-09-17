
import { TouchableOpacity, View } from 'react-native';
import { Text } from './app-text';

interface SectionHeaderProps {
    title: string;
    buttonText?: string;
    buttonClassName?: string;
    onButtonPress?: () => void;
}

const SectionHeader = ({
    title,
    buttonText = 'See All',
    buttonClassName = '',
    onButtonPress
}: SectionHeaderProps) => {
    let buttonStyles = 'px-3 py-1 bg-primary rounded-xs';
    if (buttonClassName) {
        buttonStyles += ` ${buttonClassName}`;
    }
    return (
        <View className='flex-row items-center justify-between mb-4'>
            <Text className="text-white text-xl" variant='h6' weight='semiBold'>{title}</Text>
            <TouchableOpacity onPress={onButtonPress} className={buttonStyles}>
                <Text className="text-white text-sm" variant='smallMedium' weight='medium'>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    );
};
export default SectionHeader;