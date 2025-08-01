export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-nested': {}, // Optional: Support for nested CSS
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {}, // Optional: Minify CSS in production
    }),
  },
};
