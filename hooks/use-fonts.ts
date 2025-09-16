import { useFonts } from 'expo-font';

export function useLoadFonts() {
  const [fontsLoaded] = useFonts({
    // Montserrat fonts
    'Montserrat-Regular': require('../assets/fonts/montserrat/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('../assets/fonts/montserrat/Montserrat-Medium.ttf'),
    'Montserrat-SemiBold': require('../assets/fonts/montserrat/Montserrat-SemiBold.ttf'),
    'Montserrat-Bold': require('../assets/fonts/montserrat/Montserrat-Bold.ttf'),
    'Montserrat-ExtraLight': require('../assets/fonts/montserrat/Montserrat-ExtraLight.ttf'),
    'Montserrat-Italic': require('../assets/fonts/montserrat/Montserrat-Italic.ttf'),
    'Montserrat-MediumItalic': require('../assets/fonts/montserrat/Montserrat-MediumItalic.ttf'),
    'Montserrat-SemiBoldItalic': require('../assets/fonts/montserrat/Montserrat-SemiBoldItalic.ttf'),
    'Montserrat-BoldItalic': require('../assets/fonts/montserrat/Montserrat-BoldItalic.ttf'),
    'Montserrat-ExtraBoldItalic': require('../assets/fonts/montserrat/Montserrat-ExtraBoldItalic.ttf'),
    'Montserrat-ExtraLightItalic': require('../assets/fonts/montserrat/Montserrat-ExtraLightItalic.ttf'),
    
    // Poppins fonts
    'Poppins-Regular': require('../assets/fonts/poppins/Poppins-Regular.ttf'),
    'Poppins-Light': require('../assets/fonts/poppins/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/poppins/Poppins-Medium.ttf'),
    'Poppins-Bold': require('../assets/fonts/poppins/Poppins-Bold.ttf'),
    'Poppins-Italic': require('../assets/fonts/poppins/Poppins-Italic.ttf'),
    'Poppins-LightItalic': require('../assets/fonts/poppins/Poppins-LightItalic.ttf'),
    'Poppins-MediumItalic': require('../assets/fonts/poppins/Poppins-MediumItalic.ttf'),
    'Poppins-BoldItalic': require('../assets/fonts/poppins/Poppins-BoldItalic.ttf'),
    'Poppins-SemiBoldItalic': require('../assets/fonts/poppins/Poppins-SemiBoldItalic.ttf'),
  });

  return fontsLoaded;
}

// Font family constants for easy usage
export const FontFamilies = {
  montserrat: {
    regular: 'Montserrat-Regular',
    medium: 'Montserrat-Medium',
    semiBold: 'Montserrat-SemiBold',
    bold: 'Montserrat-Bold',
    extraLight: 'Montserrat-ExtraLight',
    italic: 'Montserrat-Italic',
    mediumItalic: 'Montserrat-MediumItalic',
    semiBoldItalic: 'Montserrat-SemiBoldItalic',
    boldItalic: 'Montserrat-BoldItalic',
    extraBoldItalic: 'Montserrat-ExtraBoldItalic',
    extraLightItalic: 'Montserrat-ExtraLightItalic',
  },
  poppins: {
    regular: 'Poppins-Regular',
    light: 'Poppins-Light',
    medium: 'Poppins-Medium',
    bold: 'Poppins-Bold',
    italic: 'Poppins-Italic',
    lightItalic: 'Poppins-LightItalic',
    mediumItalic: 'Poppins-MediumItalic',
    boldItalic: 'Poppins-BoldItalic',
    semiBoldItalic: 'Poppins-SemiBoldItalic',
  },
} as const;
