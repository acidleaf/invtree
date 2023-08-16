/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

const primaryColor = colors.slate;
const accentColor = colors.lime;
const grayColor = colors.neutral;

module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js}',
  ],
  theme: {
    darkMode: 'class',
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      white: colors.white,
      black: colors.black,
      dark: '#171717',
      
      primary: {
        DEFAULT: primaryColor[500],
        ...primaryColor,
      },
      accent: {
        DEFAULT: accentColor[500],
        ...accentColor,
      },
      
      gray: {
        DEFAULT: grayColor[500],
        ...grayColor,
      },
      slate: {
        DEFAULT: colors.slate[500],
        ...colors.slate,
      },
      
      info: {
        DEFAULT: colors.sky[500],
        ...colors.sky,
      },
      success: {
        DEFAULT: colors.emerald[500],
        ...colors.emerald,
      },
      warn: {
        DEFAULT: colors.yellow[500],
        ...colors.yellow,
      },
      danger: {
        DEFAULT: colors.rose[500],
        ...colors.rose,
      },
    }
  },
  variants: {
    extend: {
      backgroundColor: [ 'disabled' ],
      textColor: [ 'disabled' ],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
