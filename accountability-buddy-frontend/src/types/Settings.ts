/**
 * Defines the structure for user settings in the application.
 */
export interface UserSettings {
    theme: "light" | "dark"; // Theme preference
    notificationsEnabled: boolean; // Whether notifications are enabled
    language: string; // Preferred language (e.g., "en", "es")
    timeZone: string; // User's timezone
  }
  
  /**
   * Defines the structure for application-wide settings.
   */
  export interface AppSettings {
    apiBaseUrl: string; // Base URL for API requests
    enablePremiumFeatures: boolean; // Whether premium features are enabled
    maxUploadSizeMB: number; // Maximum file upload size in MB
  }
  
  /**
   * Defines the structure for feature toggles.
   */
  export interface FeatureToggles {
    enableGamification: boolean; // Whether gamification is enabled
    enableLeaderboards: boolean; // Whether leaderboards are enabled
    betaFeatures: boolean; // Whether beta features are available
  }
  
  /**
   * General settings structure that includes multiple categories of settings.
   */
  export interface Settings {
    userSettings: UserSettings; // User-specific settings
    appSettings: AppSettings; // Application-wide settings
    featureToggles: FeatureToggles; // Feature toggles for the application
  }
  