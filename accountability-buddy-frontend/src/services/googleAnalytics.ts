// googleAnalytics.ts

import ReactGA from "react-ga4";


// TypeScript type definitions for event parameters
type TrackEventParams = {
  category: string;
  action: string;
  label?: string;
  value?: number;
};



// Initialize Google Analytics with your tracking ID
export const initGA = (trackingId: string = "G-XXXXXXXXXX", debug: boolean = false) => {
  ReactGA.initialize(trackingId); // Removed the debug property

  if (debug) {
    console.log(`Google Analytics initialized with ID: ${trackingId}`);
  }
};


// Track page views
export const trackPageView = (page: string) => {
  if (page) {
    ReactGA.send({ hitType: "pageview", page });
    console.log(`Page view tracked: ${page}`);
  } else {
    console.warn("Page view tracking called without a page path.");
  }
};

// Track custom events (e.g., button clicks)
export const trackEvent = ({ category, action, label, value }: TrackEventParams) => {
  if (category && action) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
    console.log(`Event tracked: Category - ${category}, Action - ${action}`);
  } else {
    console.warn("Event tracking called without category or action.");
  }
};

// Track conversions (e.g., sign-ups, upgrades)
export const trackConversion = (conversionType: string, details: string = "") => {
  if (conversionType) {
    ReactGA.event({
      category: "Conversion",
      action: conversionType,
      label: details,
    });
    console.log(`Conversion tracked: Type - ${conversionType}, Details - ${details}`);
  } else {
    console.warn("Conversion tracking called without a conversion type.");
  }
};

// Track user ID (for logged-in users)
export const trackUserId = (userId: string) => {
  if (userId) {
    ReactGA.set({ user_id: userId });
    console.log(`User ID tracked: ${userId}`);
  } else {
    console.warn("User ID tracking called without a user ID.");
  }
};

// Track errors as events
export const trackError = (description: string, fatal: boolean = false) => {
  if (description) {
    // Include the 'fatal' information in the label if needed
    ReactGA.event({
      category: "Error",
      action: "Exception",
      label: `${description} - Fatal: ${fatal}`,
    });
    console.log(`Error tracked: ${description}, Fatal: ${fatal}`);
  } else {
    console.warn("Error tracking called without a description.");
  }
};


// Track outbound links
export const trackOutboundLink = (url: string) => {
  if (url) {
    // Use the event method to track outbound link clicks
    ReactGA.event({
      category: "Outbound Link",
      action: "Click",
      label: url,
    });
    console.log(`Outbound link tracked: ${url}`);
  } else {
    console.warn("Outbound link tracking called without a URL.");
  }
};
