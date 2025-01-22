/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Example primary color
        secondary: '#9333EA', // Example secondary color
        accent: '#F59E0B', // Example accent color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Custom font family
        heading: ['Poppins', 'sans-serif'], // Custom heading font
      },
      spacing: {
        128: '32rem', // Custom spacing value
        144: '36rem',
      },
    },
  },
  darkMode: 'class', // Enable dark mode
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
};
