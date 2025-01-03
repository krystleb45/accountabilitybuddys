import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import i18n from '../config/i18n';

// Create Language Context
const LanguageContext = createContext();

// Custom hook to use LanguageContext
export const useLanguage = () => useContext(LanguageContext);

// Language Context Provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Check for saved language or detect from browser
    return localStorage.getItem('language') || navigator.language.split('-')[0] || 'en';
  });

  // Change language and persist the preference
  const changeLanguage = useCallback((lng) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  }, []);

  // Update i18n when language changes
  useEffect(() => {
    try {
      i18n.changeLanguage(language);
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
