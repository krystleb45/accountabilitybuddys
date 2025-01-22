import * as Sentry from "@sentry/react";
import LogRocket from "logrocket";

// Enhanced Log Configuration
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
        tracesSampleRate: parseFloat(
          process.env.REACT_APP_SENTRY_SAMPLE_RATE || "1.0"
        ), // Adjust sample rate dynamically
        environment: process.env.NODE_ENV, // Set environment context
        release: process.env.REACT_APP_VERSION || "unknown", // App version tracking
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
  log: function (
    message: string,
    level: "info" | "warn" | "error" = "info",
    additionalContext?: Record<string, unknown>
  ) {
    if (this.enableLogging) {
      console[level](message, additionalContext || "");
    }

    // Send errors to Sentry in production
    if (this.sentryEnabled && level === "error") {
      Sentry.captureException(new Error(message), {
        extra: additionalContext || {},
      });
    }
  },

  // Add User Context to Logs
  setUserContext: function (user: {
    id?: string;
    email?: string;
    username?: string;
  }) {
    if (this.sentryEnabled) {
      Sentry.setUser(user);
    }
    if (this.logRocketEnabled) {
      LogRocket.identify(user.id || "unknown", {
        email: user.email,
        name: user.username,
      });
    }
  },

  // Clear User Context
clearUserContext: function () {
  if (this.sentryEnabled) {
    Sentry.setUser(null); // Sentry supports null to clear user context
  }
  if (this.logRocketEnabled) {
    LogRocket.identify("unknown", {}); // Use a placeholder string instead of null
  }
},

};

// Initialize logging tools if enabled
logConfig.initSentry();
logConfig.initLogRocket();

// Example Usage:
// logConfig.log('This is an info message');
// logConfig.log('This is an error message', 'error');
// logConfig.setUserContext({ id: '123', email: 'user@example.com', username: 'JohnDoe' });
// logConfig.clearUserContext();

export default logConfig;
