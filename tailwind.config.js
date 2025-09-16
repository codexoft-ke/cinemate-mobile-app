/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
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
    },
  },
  plugins: [],
}

