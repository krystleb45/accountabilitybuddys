import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Example: Google Analytics tracking
    if (window.gtag) {
      window.gtag("config", "YOUR_GOOGLE_ANALYTICS_ID", {
        page_path: location.pathname,
      });
    }
    console.log(`Page view tracked: ${location.pathname}`);
  }, [location]);

  return null;
};

export default AnalyticsTracker;
