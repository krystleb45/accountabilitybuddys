import ReactGA from 'react-ga4';

// Initialize Google Analytics with your tracking ID
export const initGA = (trackingId = 'G-XXXXXXXXXX', debug = false) => {
  ReactGA.initialize(trackingId, {
    debug, // Enable debugging if true
  });
  if (debug) {
    console.log(`Google Analytics initialized with ID: ${trackingId}`);
  }
};

// Track page views
export const trackPageView = (page) => {
  if (page) {
    ReactGA.send({ hitType: 'pageview', page });
    console.log(`Page view tracked: ${page}`);
  } else {
    console.warn('Page view tracking called without a page path.');
  }
};

// Track custom events (e.g., button clicks)
export const trackEvent = ({ category, action, label, value }) => {
  if (category && action) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
    console.log(`Event tracked: Category - ${category}, Action - ${action}`);
  } else {
    console.warn('Event tracking called without category or action.');
  }
};

// Track conversions (e.g., sign-ups, upgrades)
export const trackConversion = (conversionType, details = '') => {
  if (conversionType) {
    ReactGA.event({
      category: 'Conversion',
      action: conversionType,
      label: details,
    });
    console.log(`Conversion tracked: Type - ${conversionType}, Details - ${details}`);
  } else {
    console.warn('Conversion tracking called without a conversion type.');
  }
};

// Track user ID (for logged-in users)
export const trackUserId = (userId) => {
  if (userId) {
    ReactGA.set({ user_id: userId });
    console.log(`User ID tracked: ${userId}`);
  } else {
    console.warn('User ID tracking called without a user ID.');
  }
};

// Track errors as events
export const trackError = (description, fatal = false) => {
  if (description) {
    ReactGA.event({
      category: 'Error',
      action: 'Exception',
      label: description,
      fatal,
    });
    console.log(`Error tracked: ${description}, Fatal: ${fatal}`);
  } else {
    console.warn('Error tracking called without a description.');
  }
};

// Track outbound links
export const trackOutboundLink = (url) => {
  if (url) {
    ReactGA.outboundLink({ label: url }, () => {
      console.log(`Outbound link tracked: ${url}`);
    });
  } else {
    console.warn('Outbound link tracking called without a URL.');
  }
};
