import mixpanel from "mixpanel-browser";

// Initialize Mixpanel with your token
export const initMixpanel = (token: string = "YOUR_MIXPANEL_TOKEN", debug: boolean = false): void => {
  if (!token) {
    console.error("Mixpanel token is missing.");
    return;
  }

  mixpanel.init(token, { debug });
  console.log(`Mixpanel initialized with token: ${token}`);
};

// Track page views
export const trackPageView = (page: string): void => {
  if (!page) {
    console.warn("Page view tracking called without a page name.");
    return;
  }

  mixpanel.track("Page View", { page });
  console.log(`Page view tracked: ${page}`);
};

// Track specific events
export const trackEvent = (eventName: string, properties: Record<string, any> = {}): void => {
  if (!eventName) {
    console.warn("Event tracking called without an event name.");
    return;
  }

  mixpanel.track(eventName, properties);
  console.log(`Event tracked: ${eventName}`, properties);
};

// Track user sessions for retention analysis
export const trackUserSession = (userId: string): void => {
  if (!userId) {
    console.warn("User session tracking called without a user ID.");
    return;
  }

  mixpanel.identify(userId);
  mixpanel.people.set({ $last_login: new Date() });
  console.log(`User session tracked for ID: ${userId}`);
};

// Track feature usage for retention optimization
export const trackFeatureUsage = (featureName: string): void => {
  if (!featureName) {
    console.warn("Feature usage tracking called without a feature name.");
    return;
  }

  mixpanel.track("Feature Usage", { feature: featureName });
  console.log(`Feature usage tracked: ${featureName}`);
};

// Track revenue or purchases
export const trackRevenue = (amount: number, properties: Record<string, any> = {}): void => {
  if (!amount || amount <= 0) {
    console.warn("Revenue tracking called with invalid or missing amount.");
    return;
  }

  mixpanel.track("Revenue", { amount, ...properties });
  console.log(`Revenue tracked: Amount - ${amount}`, properties);
};

// Set user profile properties
export const setUserProfile = (userId: string, properties: Record<string, any>): void => {
  if (!userId) {
    console.warn("User profile setting called without a user ID.");
    return;
  }

  mixpanel.identify(userId);
  mixpanel.people.set(properties);
  console.log(`User profile updated for ID: ${userId}`, properties);
};

// Increment user property (e.g., usage count)
export const incrementUserProperty = (userId: string, property: string, incrementBy: number = 1): void => {
  if (!userId || !property) {
    console.warn("User property increment called without a user ID or property name.");
    return;
  }

  mixpanel.identify(userId);
  mixpanel.people.increment(property, incrementBy);
  console.log(`User property incremented: ID - ${userId}, Property - ${property}, Incremented By - ${incrementBy}`);
};
