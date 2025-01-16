import mixpanel from "mixpanel-browser";


// Initialize Mixpanel with your token
export const initMixpanel = (token: string = "YOUR_MIXPANEL_TOKEN") => {
  mixpanel.init(token, { debug: true });
  console.log(`Mixpanel initialized with token: ${token}`);
};

// Track page views
export const trackPageView = (page: string) => {
  mixpanel.track("Page View", { page });
  console.log(`Page view tracked: ${page}`);
};

// Track specific events
export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  mixpanel.track(eventName, properties);
  console.log(`Event tracked: ${eventName}`, properties);
};

// Track user sessions for retention analysis
export const trackUserSession = (userId: string) => {
  mixpanel.identify(userId);
  mixpanel.people.set({ $last_login: new Date() });
  console.log(`User session tracked for ID: ${userId}`);
};

// Track feature usage for retention optimization
export const trackFeatureUsage = (featureName: string) => {
  mixpanel.track("Feature Usage", { feature: featureName });
  console.log(`Feature usage tracked: ${featureName}`);
};
