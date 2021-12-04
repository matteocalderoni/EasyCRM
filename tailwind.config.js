module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or false or 'class'
  theme: {
    extend: {},
  },
  variants: {    
    extend: {
      backgroundColor: ['checked', 'hover', 'focus'],
      borderColor: ['checked', 'hover', 'focus'],
      textColor: ['responsive', 'hover', 'focus', 'group-hover']
    },
  },
  plugins: [],
}
