import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with your token
export const initMixpanel = (token = 'YOUR_MIXPANEL_TOKEN') => {
  mixpanel.init(token, { debug: true });
  console.log(`Mixpanel initialized with token: ${token}`);
};

// Track page views
export const trackPageView = (page) => {
  mixpanel.track('Page View', { page });
  console.log(`Page view tracked: ${page}`);
};

// Track specific events
export const trackEvent = (eventName, properties = {}) => {
  mixpanel.track(eventName, properties);
  console.log(`Event tracked: ${eventName}`, properties);
};

// Track user sessions for retention analysis
export const trackUserSession = (userId) => {
  mixpanel.identify(userId);
  mixpanel.people.set({ $last_login: new Date() });
  console.log(`User session tracked for ID: ${userId}`);
};

// Track feature usage for retention optimization
export const trackFeatureUsage = (featureName) => {
  mixpanel.track('Feature Usage', { feature: featureName });
  console.log(`Feature usage tracked: ${featureName}`);
};
