/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // CineMate Brand Colors
        primary: {
          DEFAULT: '#9810FA',
          dark: '#7A0BC7',
          light: '#B142FB',
        },
        
        // Custom background colors
        'dark-bg': '#0B1826',
        'alt-bg': '#192C40',
        'light-bg': '#FFFFFF',
        
        // Movie rating colors
        rating: {
          gold: '#FFD700',
          green: '#32D74B',
          orange: '#FF9F0A',
          red: '#FF453A',
        },
        
        // Genre colors
        genre: {
          action: '#FF6B6B',
          comedy: '#4ECDC4',
          drama: '#45B7D1',
          horror: '#96CEB4',
          romance: '#FFEAA7',
          scifi: '#DDA0DD',
          thriller: '#98D8C8',
        },
        
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B0B0',
          tertiary: '#8E8E93',
          inverse: '#11181C',
        },
        
        // Status colors
        status: {
          online: '#32D74B',
          offline: '#8E8E93',
          loading: '#9810FA',
        },
        
        // Additional theme colors
        surface: {
          light: '#F8F9FA',
          dark: '#192C40',
        },
        
        accent: '#E91E63',
        
        success: '#32D74B',
        warning: '#FF9F0A',
        error: '#FF453A',
      },
      
      fontFamily: {
        'bold': ['Montserrat-Bold'],
        'semiBold': ['Montserrat-SemiBold'],
        'medium': ['Montserrat-Medium'],
        'regular': ['Montserrat-Regular'],
        'light': ['Poppins-Light'],
        
        // Montserrat fonts
        'montserrat': ['Montserrat-Regular'],
        'montserrat-medium': ['Montserrat-Medium'],
        'montserrat-semibold': ['Montserrat-SemiBold'],
        'montserrat-bold': ['Montserrat-Bold'],
        'montserrat-extralight': ['Montserrat-ExtraLight'],
        'montserrat-italic': ['Montserrat-Italic'],
        'montserrat-medium-italic': ['Montserrat-MediumItalic'],
        'montserrat-semibold-italic': ['Montserrat-SemiBoldItalic'],
        'montserrat-bold-italic': ['Montserrat-BoldItalic'],
        'montserrat-extrabold-italic': ['Montserrat-ExtraBoldItalic'],
        'montserrat-extralight-italic': ['Montserrat-ExtraLightItalic'],
        
        // Poppins fonts
        'poppins': ['Poppins-Regular'],
        'poppins-light': ['Poppins-Light'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-bold': ['Poppins-Bold'],
        'poppins-italic': ['Poppins-Italic'],
        'poppins-light-italic': ['Poppins-LightItalic'],
        'poppins-medium-italic': ['Poppins-MediumItalic'],
        'poppins-bold-italic': ['Poppins-BoldItalic'],
        'poppins-semibold-italic': ['Poppins-SemiBoldItalic'],
      },
      
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '40px',
        'xxxl': '48px',
      },
      
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'xxl': '24px',
      },
    },
  },
  plugins: [],
}

