const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
        heading: ['gilroy-extrabold', 'Montserrat', ...defaultTheme.fontFamily.sans],
        brand: ['aristotelicatext-extralight', 'Montserrat', ...defaultTheme.fontFamily.sans],
      },
    },
  },
}
