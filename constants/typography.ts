import { FontFamilies } from '@/hooks/use-fonts';

// Typography styles for consistent use across the app
export const Typography = {
  // Headers
  h1: {
    fontFamily: FontFamilies.montserrat.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: FontFamilies.montserrat.semiBold,
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontFamily: FontFamilies.montserrat.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontFamily: FontFamilies.montserrat.medium,
    fontSize: 20,
    lineHeight: 28,
  },
  h5: {
    fontFamily: FontFamilies.montserrat.medium,
    fontSize: 18,
    lineHeight: 24,
  },
  h6: {
    fontFamily: FontFamilies.montserrat.medium,
    fontSize: 16,
    lineHeight: 22,
  },
  span: {
    fontFamily: FontFamilies.montserrat.medium,
    fontSize: 14,
    lineHeight: 20,
  },

  paragraph: {
    fontFamily: FontFamilies.montserrat.medium,
    fontSize: 10,
    lineHeight: 18,
  },
  
  // Body text
  body: {
    fontFamily: FontFamilies.poppins.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: FontFamilies.poppins.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: FontFamilies.poppins.bold,
    fontSize: 16,
    lineHeight: 24,
  },
  
  // Small text
  small: {
    fontFamily: FontFamilies.poppins.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  smallMedium: {
    fontFamily: FontFamilies.poppins.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Caption
  caption: {
    fontFamily: FontFamilies.poppins.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  captionMedium: {
    fontFamily: FontFamilies.poppins.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  
  // Movie-specific styles
  movieTitle: {
    fontFamily: FontFamilies.montserrat.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  movieSubtitle: {
    fontFamily: FontFamilies.poppins.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  movieDescription: {
    fontFamily: FontFamilies.poppins.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  movieRating: {
    fontFamily: FontFamilies.montserrat.semiBold,
    fontSize: 16,
    lineHeight: 20,
  },
  
  // Button text
  button: {
    fontFamily: FontFamilies.poppins.medium,
    fontSize: 16,
    lineHeight: 20,
  },
  buttonSmall: {
    fontFamily: FontFamilies.poppins.medium,
    fontSize: 14,
    lineHeight: 16,
  },
} as const;

// Font weights for easy reference
export const FontWeights = {
  light: FontFamilies.poppins.light,
  regular: FontFamilies.poppins.regular,
  medium: FontFamilies.poppins.medium,
  semiBold: FontFamilies.montserrat.semiBold,
  bold: FontFamilies.montserrat.bold,
} as const;
