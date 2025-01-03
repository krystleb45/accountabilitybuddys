// Feature Flags Configuration
const featureFlags = {
  // Core Feature Flags
  enableBetaFeatures: process.env.REACT_APP_ENABLE_BETA === "true",
  showNewDashboard: process.env.REACT_APP_SHOW_NEW_DASHBOARD === "true",

  // Additional Features
  enableDarkMode: process.env.REACT_APP_ENABLE_DARK_MODE === "true",
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
  enableMultiLanguageSupport:
    process.env.REACT_APP_ENABLE_MULTI_LANGUAGE === "true",

  // Experimental Features (can be grouped together)
  experimental: {
    enableTaskAutomation:
      process.env.REACT_APP_ENABLE_TASK_AUTOMATION === "true",
    enableAIRecommendations:
      process.env.REACT_APP_ENABLE_AI_RECOMMENDATIONS === "true",
  },

  // Function to check if a specific feature is enabled
  isFeatureEnabled: (featureName) => {
    return !!featureFlags[featureName];
  },

  // Function to check if experimental features are enabled
  isExperimentalFeatureEnabled: (featureName) => {
    return !!featureFlags.experimental[featureName];
  },
};

// Example usage:
// featureFlags.isFeatureEnabled('enableBetaFeatures');
// featureFlags.isExperimentalFeatureEnabled('enableTaskAutomation');

export default featureFlags;
