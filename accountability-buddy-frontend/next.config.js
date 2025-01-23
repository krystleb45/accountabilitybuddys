const nextConfig = {
  reactStrictMode: true, // Enables React strict mode for better debugging
  swcMinify: true, // Uses SWC for faster builds and smaller bundle sizes
  compiler: {
    styledComponents: {
      ssr: true, // Enable server-side rendering for styled-components
      displayName: true, // Use display names in development
      preprocess: false, // Disable preprocessing to avoid potential issues
    },
  },
  images: {
    domains: ['example.com', 'another-domain.com'], // Replace with your image domains
    formats: ['image/avif', 'image/webp'], // Optimize for modern formats
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL, // Example environment variable
  },
  webpack(config, { isServer }) {
    // Example: Modify Webpack configuration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // Resolve Node.js 'fs' module issues in the browser
      };
    }
    return config;
  },
};

module.exports = nextConfig;
