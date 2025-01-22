// Enhanced Feature Flags Configuration
interface FeatureFlags {
  enableBetaFeatures: boolean;
  showNewDashboard: boolean;
  enableDarkMode: boolean;
  enableAnalytics: boolean;
  enableMultiLanguageSupport: boolean;
  experimental: {
    enableTaskAutomation: boolean;
    enableAIRecommendations: boolean;
    [key: string]: boolean; // Allows for future experimental features
  };
  isFeatureEnabled: (
    featureName: keyof Omit<FeatureFlags, 'experimental'>
  ) => boolean;
  isExperimentalFeatureEnabled: (
    featureName: keyof FeatureFlags['experimental']
  ) => boolean;
}

const featureFlags: FeatureFlags = {
  // Core Feature Flags
  enableBetaFeatures: process.env.REACT_APP_ENABLE_BETA === 'true',
  showNewDashboard: process.env.REACT_APP_SHOW_NEW_DASHBOARD === 'true',

  // Additional Features
  enableDarkMode: process.env.REACT_APP_ENABLE_DARK_MODE === 'true',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableMultiLanguageSupport:
    process.env.REACT_APP_ENABLE_MULTI_LANGUAGE === 'true',

  // Experimental Features (can be grouped together)
  experimental: {
    enableTaskAutomation:
      process.env.REACT_APP_ENABLE_TASK_AUTOMATION === 'true',
    enableAIRecommendations:
      process.env.REACT_APP_ENABLE_AI_RECOMMENDATIONS === 'true',
  },

  // Function to check if a specific feature is enabled
  isFeatureEnabled: function (featureName) {
    return !!this[featureName];
  },

  // Function to check if experimental features are enabled
  isExperimentalFeatureEnabled: function (featureName) {
    return !!this.experimental[featureName];
  },
};

// Example usage:
// featureFlags.isFeatureEnabled('enableBetaFeatures');
// featureFlags.isExperimentalFeatureEnabled('enableTaskAutomation');

export default featureFlags;
