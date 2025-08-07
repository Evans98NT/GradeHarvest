/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#001F3F',
          light: '#003366',
          dark: '#001633'
        },
        grey: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
          dark: '#4B5563'
        },
        white: '#FFFFFF'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
