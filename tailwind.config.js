const theme = require('tailwindcss/defaultTheme')
const formPlugin = require('@tailwindcss/forms')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        ...theme.fontFamily,
        sans: ['Inter', ...theme.fontFamily.serif],
      },
      colors: {
        pink: {
          500: '#E4526E',
          600: '#E13F5E',
          700: '#CA3854',
        },
        purple: {
          200: '#a191de',
          600: '#8570e4',
          700: '#6353bd',
        },
      },
    },
  },
  plugins: [formPlugin],
}
