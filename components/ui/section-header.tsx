
import { BorderRadius } from '@/constants/theme';
import { TouchableOpacity, View } from 'react-native';
import { Text } from './app-text';

interface SectionHeaderProps {
    title: string;
    buttonText?: string;
    showButton?: boolean;
    buttonClassName?: string;
    onButtonPress?: () => void;
}

const SectionHeader = ({
    title,
    buttonText = 'See All',
    showButton = true,
    buttonClassName = '',
    onButtonPress
}: SectionHeaderProps) => {
    const defaultButtonStyles = `px-3 py-1 bg-primary rounded-md`;
    const buttonStyles = buttonClassName ? `${defaultButtonStyles} ${buttonClassName}` : defaultButtonStyles;

    return (
        <View className='flex-row items-center justify-between mb-4'>
            <Text className="text-white" variant='h6' weight='semiBold'>{title}</Text>
            {showButton && (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onButtonPress}
                    className={buttonStyles}
                    style={{
                        borderRadius: BorderRadius.md,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 3,
                    }}
                >
                    <Text className="text-white" variant='buttonSmall' weight='medium'>{buttonText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SectionHeader;