import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import * as serviceWorkerRegistration from "./services/serviceWorkerRegistration";
import ThemeProvider from "./context/ui/ThemeContext";
import { LanguageProvider } from "./context/settings/LanguageContext";
import { UserProvider } from "src/context/data/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);

try {
  serviceWorkerRegistration.register({
    onUpdate: (registration: ServiceWorkerRegistration) => {
      if (registration.waiting) {
        if (window.confirm("A new version is available. Reload to update?")) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          window.location.reload();
        }
      }
    },
    onSuccess: () => {
      console.log("Service worker registered successfully.");
    },
  });
} catch (error) {
  console.error("Service worker registration failed:", error);
}

// Add global error handling for unexpected issues
window.addEventListener("error", (event) => {
  console.error("Global error occurred:", event.error);
});

// Optional: Handle unhandled promise rejections globally
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
