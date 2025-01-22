/**
 * TypeScript type definitions for environment variables.
 * These definitions ensure type safety and better IntelliSense support
 * when accessing `process.env` in your application.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Base URL for API endpoints.
     * Example: https://api.example.com
     */
    REACT_APP_API_URL: string;

    /**
     * Node environment.
     * Can be 'development', 'production', or 'test'.
     */
    NODE_ENV: 'development' | 'production' | 'test';

    /**
     * Public key for a third-party service.
     * Example: pk_test_123456789abcdef
     */
    REACT_APP_PUBLIC_KEY?: string;

    /**
     * Google Analytics tracking ID.
     * Example: UA-12345678-1
     */
    REACT_APP_GA_TRACKING_ID?: string;

    /**
     * Stripe publishable key for payments.
     * Example: pk_live_123456789abcdef
     */
    REACT_APP_STRIPE_KEY?: string;

    /**
     * Feature flag for enabling beta features.
     * Can be true or false.
     */
    REACT_APP_ENABLE_BETA?: 'true' | 'false';

    /**
     * Custom environment-specific variable.
     * Add any additional environment variable names below.
     */
    [key: string]: string | undefined; // Allow additional environment variables
  }
}
