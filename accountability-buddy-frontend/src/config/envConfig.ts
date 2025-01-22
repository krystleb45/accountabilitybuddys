// Enhanced Environment Variables Configuration
const envConfig = {
  // API Base URL
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",

  // Google API Key
  googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",

  // Sentry DSN for Error Tracking
  sentryDsn: process.env.REACT_APP_SENTRY_DSN || "",

  // Environment (e.g., development, production, staging)
  environment: process.env.NODE_ENV || "development",

  // Feature Toggles (useful for enabling/disabling features in specific environments)
  enableBetaFeatures: process.env.REACT_APP_ENABLE_BETA === "true",
  enableDebugMode: process.env.REACT_APP_DEBUG_MODE === "true",

  // Authentication Configuration
  auth: {
    tokenKey: process.env.REACT_APP_AUTH_TOKEN_KEY || "authToken",
    refreshTokenKey: process.env.REACT_APP_REFRESH_TOKEN_KEY || "refreshToken",
  },

  // App-specific Configuration
  appName: process.env.REACT_APP_NAME || "Accountability Buddy",
  appVersion: process.env.REACT_APP_VERSION || "1.0.0",

  // Analytics & Tracking
  analyticsId: process.env.REACT_APP_ANALYTICS_ID || "",
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === "true",

  // Timeouts (e.g., for API requests)
  requestTimeout: parseInt(process.env.REACT_APP_REQUEST_TIMEOUT || "15000", 10), // Defaults to 15 seconds

  // Placeholder for Additional Configuration
  additionalConfig: process.env.REACT_APP_ADDITIONAL_CONFIG || "",

  // Security Headers
  securityHeaders: {
    contentSecurityPolicy: process.env.REACT_APP_CSP || "default-src 'self'; script-src 'self';",
    xFrameOptions: process.env.REACT_APP_X_FRAME_OPTIONS || "SAMEORIGIN",
    strictTransportSecurity: process.env.REACT_APP_HSTS || "max-age=31536000; includeSubDomains",
  },

  // Placeholder for integrations
  integrations: {
    stripeApiKey: process.env.REACT_APP_STRIPE_API_KEY || "",
    firebaseConfig: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
    },
  },
};

// Ensure required variables are set in production
if (envConfig.environment === "production") {
  if (!envConfig.apiBaseUrl) {
    console.warn("Warning: API Base URL is not set for production!");
  }
  if (!envConfig.googleApiKey) {
    console.warn("Warning: Google API Key is not set for production!");
  }
  if (!envConfig.sentryDsn) {
    console.warn("Warning: Sentry DSN is not set for production!");
  }
}

export default envConfig;
