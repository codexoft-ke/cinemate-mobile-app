/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// CineMate Brand Colors
const primaryColor = '#d200d7';
const darkBackground = '#0B1826';
const altBackground = '#192C40';

const tintColorLight = primaryColor;
const tintColorDark = primaryColor;

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    card: '#FFFFFF',
    primary: primaryColor,
    primaryText: '#FFFFFF',
    secondary: '#6C757D',
    accent: '#E91E63',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#FFFFFF',
    border: '#E5E5E5',
    notification: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    background: darkBackground,
    surface: altBackground,
    card: altBackground,
    primary: primaryColor,
    primaryText: '#FFFFFF',
    secondary: '#8E8E93',
    accent: '#E91E63',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
    border: '#2C2C2E',
    notification: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
  },
};

// CineMate specific color palette
export const CineMateColors = {
  primary: primaryColor,
  primaryDark: '#7A0BC7',
  primaryLight: '#B142FB',
  
  // Backgrounds
  darkBg: darkBackground,
  altBg: altBackground,
  lightBg: '#FFFFFF',
  
  // Gradients (for use with LinearGradient)
  primaryGradient: [primaryColor, '#7A0BC7'],
  backgroundGradient: [darkBackground, altBackground],
  
  // Movie rating colors
  ratingGold: '#FFD700',
  ratingGreen: '#32D74B',
  ratingOrange: '#FF9F0A',
  ratingRed: '#FF453A',
  
  // Genre colors
  action: '#FF6B6B',
  comedy: '#4ECDC4',
  drama: '#45B7D1',
  horror: '#96CEB4',
  romance: '#FFEAA7',
  sciFi: '#DDA0DD',
  thriller: '#98D8C8',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#8E8E93',
  textInverse: '#11181C',
  
  // Status colors
  online: '#32D74B',
  offline: '#8E8E93',
  loading: primaryColor,
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Helper function to get theme colors based on color scheme
export const getThemeColors = (isDark: boolean) => {
  return isDark ? Colors.dark : Colors.light;
};

// Theme sizing and spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
} as const;
