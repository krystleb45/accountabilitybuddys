// googleAnalytics.ts

import ReactGA from "react-ga4";

// TypeScript type definitions for event parameters
interface TrackEventParams {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

// Initialize Google Analytics with your tracking ID
export const initGA = (trackingId: string = "G-XXXXXXXXXX", debug: boolean = false): void => {
  if (!trackingId) {
    console.error("Google Analytics tracking ID is missing.");
    return;
  }

  ReactGA.initialize(trackingId);
  if (debug) {
    console.log(`Google Analytics initialized with ID: ${trackingId}`);
  }
};

// Track page views
export const trackPageView = (page: string): void => {
  if (!page) {
    console.warn("Page view tracking called without a page path.");
    return;
  }

  ReactGA.send({ hitType: "pageview", page });
  console.log(`Page view tracked: ${page}`);
};

// Track custom events (e.g., button clicks)
export const trackEvent = ({ category, action, label, value }: TrackEventParams): void => {
  if (!category || !action) {
    console.warn("Event tracking called without category or action.");
    return;
  }

  ReactGA.event({
    category,
    action,
    label,
    value,
  });
  console.log(`Event tracked: Category - ${category}, Action - ${action}, Label - ${label}, Value - ${value}`);
};

// Track conversions (e.g., sign-ups, upgrades)
export const trackConversion = (conversionType: string, details: string = ""): void => {
  if (!conversionType) {
    console.warn("Conversion tracking called without a conversion type.");
    return;
  }

  ReactGA.event({
    category: "Conversion",
    action: conversionType,
    label: details,
  });
  console.log(`Conversion tracked: Type - ${conversionType}, Details - ${details}`);
};

// Track user ID (for logged-in users)
export const trackUserId = (userId: string): void => {
  if (!userId) {
    console.warn("User ID tracking called without a user ID.");
    return;
  }

  ReactGA.set({ user_id: userId });
  console.log(`User ID tracked: ${userId}`);
};

// Track errors as events
export const trackError = (description: string, fatal: boolean = false): void => {
  if (!description) {
    console.warn("Error tracking called without a description.");
    return;
  }

  ReactGA.event({
    category: "Error",
    action: "Exception",
    label: description,
    value: fatal ? 1 : 0, // Use value to indicate whether the error is fatal
  });
  console.log(`Error tracked: ${description}, Fatal: ${fatal}`);
};

// Track outbound links
export const trackOutboundLink = (url: string): void => {
  if (!url) {
    console.warn("Outbound link tracking called without a URL.");
    return;
  }

  ReactGA.event({
    category: "Outbound Link",
    action: "Click",
    label: url,
  });
  console.log(`Outbound link tracked: ${url}`);
};
