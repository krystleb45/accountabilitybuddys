import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * AnalyticsTracker Component
 *
 * This component tracks page views and sends data to Google Analytics (or other analytics tools).
 */
const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = () => {
      const analyticsId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;

      if (!analyticsId) {
        console.warn("Google Analytics ID is not configured.");
        return;
      }

      if (window.gtag) {
        window.gtag("config", analyticsId, {
          page_path: location.pathname,
        });
        console.log(`Page view tracked: ${location.pathname}`);
      } else {
        console.warn("Google Analytics is not initialized.");
      }
    };

    trackPageView();
  }, [location]);

  return null;
};

export default AnalyticsTracker;