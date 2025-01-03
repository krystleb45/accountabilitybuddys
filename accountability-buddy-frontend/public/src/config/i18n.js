import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Translations JSON (mockup)
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      login: 'Login',
    },
  },
  es: {
    translation: {
      welcome: 'Bienvenido',
      login: 'Iniciar sesión',
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
    fallbackLng: 'en', // Defaults to English if no language is detected
    lng: localStorage.getItem('language') || 'en', // Uses saved language or defaults to English
    debug: process.env.NODE_ENV === 'development', // Debug mode enabled in development
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'], // Detection order
      caches: ['localStorage'], // Saves detected language in localStorage
    },
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to load translation files
    },
    react: {
      useSuspense: false, // Prevents suspense errors during initial load
    },
  });

// Function to change language
export const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('language', lng);
};

// Example usage:
// changeLanguage('es'); // Switches to Spanish

export default i18n;
