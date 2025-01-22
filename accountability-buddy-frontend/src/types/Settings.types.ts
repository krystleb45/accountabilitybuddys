/**
 * Represents user-specific settings in the application.
 */
export interface UserSettings {
  /** Theme preference: light or dark. */
  theme: "light" | "dark";

  /** Indicates if notifications are enabled. */
  notificationsEnabled: boolean;

  /** Preferred language for the user (e.g., "en", "es", "fr"). */
  language: string;

  /** User's time zone in IANA format (e.g., "America/New_York"). */
  timeZone: string;

  /** Accessibility options for the user (e.g., larger fonts, high contrast). */
  accessibilityOptions?: {
    highContrastMode: boolean;
    textToSpeech: boolean;
  };

  /** Customizable preferences for notifications (optional). */
  notificationPreferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

/**
 * Represents application-wide settings.
 */
export interface AppSettings {
  /** Base URL for API requests. */
  apiBaseUrl: string;

  /** Indicates if premium features are enabled. */
  enablePremiumFeatures: boolean;

  /** Maximum file upload size in MB. */
  maxUploadSizeMB: number;

  /** The current version of the application. */
  appVersion: string;

  /** Indicates if maintenance mode is active. */
  maintenanceMode: boolean;

  /** Supported languages in the application. */
  supportedLanguages: string[];
}

/**
 * Represents feature toggles for the application.
 */
export interface FeatureToggles {
  /** Indicates if gamification features are enabled. */
  enableGamification: boolean;

  /** Indicates if leaderboards are enabled. */
  enableLeaderboards: boolean;

  /** Indicates if beta features are available for testing. */
  betaFeatures: boolean;

  /** Indicates if real-time chat is enabled. */
  enableRealTimeChat: boolean;

  /** Indicates if user analytics features are enabled. */
  enableUserAnalytics: boolean;
}

/**
 * Represents the structure of all application settings, including user-specific,
 * application-wide, and feature toggles.
 */
export interface Settings {
  /** User-specific settings. */
  userSettings: UserSettings;

  /** Application-wide settings. */
  appSettings: AppSettings;

  /** Feature toggles for enabling/disabling application features. */
  featureToggles: FeatureToggles;
}
