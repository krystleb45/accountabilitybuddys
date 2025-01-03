import * as Sentry from "@sentry/react";
import LogRocket from "logrocket";

// Log Configuration
const logConfig = {
  // Sentry Configuration
  sentryDsn: process.env.REACT_APP_SENTRY_DSN || "",
  sentryEnabled:
    process.env.NODE_ENV === "production" && !!process.env.REACT_APP_SENTRY_DSN,

  // LogRocket Configuration
  logRocketAppId: process.env.REACT_APP_LOGROCKET_APP_ID || "",
  logRocketEnabled:
    process.env.NODE_ENV === "production" &&
    !!process.env.REACT_APP_LOGROCKET_APP_ID,

  // Enable/Disable Console Logging
  enableLogging:
    process.env.REACT_APP_ENABLE_LOGGING === "true" ||
    process.env.NODE_ENV === "development",

  // Initialize Sentry
  initSentry: function () {
    if (this.sentryEnabled) {
      Sentry.init({
        dsn: this.sentryDsn,
        tracesSampleRate: 1.0, // Adjust the sample rate for performance monitoring
      });
      console.log("Sentry initialized for error tracking");
    }
  },

  // Initialize LogRocket
  initLogRocket: function () {
    if (this.logRocketEnabled) {
      LogRocket.init(this.logRocketAppId);

      // Optionally, integrate LogRocket with Sentry
      if (this.sentryEnabled) {
        LogRocket.getSessionURL((sessionURL) => {
          Sentry.setContext("session", { url: sessionURL });
        });
      }
      console.log("LogRocket initialized for session tracking");
    }
  },

  // Generic Logger
  log: function (message, level = "info") {
    if (this.enableLogging) {
      console[level](message); // Logs message to console based on specified level
    }
    // Send errors to Sentry in production
    if (this.sentryEnabled && level === "error") {
      Sentry.captureException(new Error(message));
    }
  },
};

// Initialize logging tools if enabled
logConfig.initSentry();
logConfig.initLogRocket();

// Example Usage:
// logConfig.log('This is an info message');
// logConfig.log('This is an error message', 'error');

export default logConfig;
