/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

export const content = [
  './app/**/*.{js,ts,jsx,tsx}', // App directory
  './components/**/*.{js,ts,jsx,tsx}', // Components directory
  './pages/**/*.{js,ts,jsx,tsx}', // Pages directory
  './layouts/**/*.{js,ts,jsx,tsx}', // Layouts directory
  './src/**/*.{js,ts,jsx,tsx}', // Catch-all for src directory
];

export const theme = {
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
};

export const darkMode = 'class';

export const plugins = [
  forms,
  typography,
  aspectRatio,
  // Removed require('@tailwindcss/line-clamp') as it is included by default in TailwindCSS v3.3+
];
