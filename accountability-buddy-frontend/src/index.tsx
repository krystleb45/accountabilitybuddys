import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import * as serviceWorkerRegistration from "./services/serviceWorkerRegistration";
import ThemeProvider from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { UserProvider } from "./context/UserContext";

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

serviceWorkerRegistration.register({
  onUpdate: (registration: ServiceWorkerRegistration) => {
    if (window.confirm("A new version is available. Reload to update?")) {
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  },
  onSuccess: () => {
    console.log("Service worker registered successfully.");
  },
  onError: (error: Error) => {
    console.error("Service worker registration failed:", error);
  },
});
