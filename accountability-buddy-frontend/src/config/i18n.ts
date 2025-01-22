import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Translations JSON (mockup)
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      login: "Login",
      logout: "Logout",
      dashboard: "Dashboard",
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      dashboard: "Tablero",
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue",
      login: "Connexion",
      logout: "Déconnexion",
      dashboard: "Tableau de bord",
    },
  },
};

// Initialize i18n
i18n
  .use(Backend) // Loads translations from external files
  .use(LanguageDetector) // Detects language from browser settings, URL, etc.
  .use(initReactI18next) // Integrates with React
  .init({
    resources,
    fallbackLng: "en", // Defaults to English if no language is detected
    lng: localStorage.getItem("language") || "en", // Uses saved language or defaults to English
    debug: process.env.NODE_ENV === "development", // Debug mode enabled in development
    detection: {
      order: ["localStorage", "querystring", "cookie", "navigator", "htmlTag"], // Enhanced detection order
      caches: ["localStorage", "cookie"], // Saves detected language in localStorage and cookies
    },
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to load translation files
      addPath: "/locales/add/{{lng}}/{{ns}}", // Path to post new translations (optional)
      allowMultiLoading: true,
    },
    react: {
      useSuspense: true, // Enable suspense for lazy loading translations
    },
  });

// Function to change language
export const changeLanguage = (lng: string): void => {
  i18n.changeLanguage(lng);
  localStorage.setItem("language", lng);
};

// Utility to get the current language
export const getCurrentLanguage = (): string => i18n.language || "en";

// Example usage:
// changeLanguage('es'); // Switches to Spanish
// console.log(getCurrentLanguage()); // Logs the current language

export default i18n;
