import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import i18n from '../../config/i18n';

// Define the shape of the LanguageContext
interface LanguageContextType {
  language: string;
  changeLanguage: (lng: string) => void;
  getSupportedLanguages: () => string[]; // New method to retrieve supported languages
}

// Create Language Context with the appropriate type
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Custom hook to use LanguageContext
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// LanguageProvider component props
interface LanguageProviderProps {
  children: ReactNode;
}

// Define supported languages
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'zh', 'ar'];

// Language Context Provider
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>(() => {
    // Check for saved language or detect from browser
    return (
      localStorage.getItem('language') ||
      navigator.language.split('-')[0] ||
      'en'
    );
  });

  // Change language and persist the preference
  const changeLanguage = useCallback((lng: string) => {
    if (SUPPORTED_LANGUAGES.includes(lng)) {
      setLanguage(lng);
      i18n.changeLanguage(lng);
      localStorage.setItem('language', lng);
    } else {
      console.warn(`Unsupported language: ${lng}`);
    }
  }, []);

  // Get supported languages
  const getSupportedLanguages = useCallback(() => SUPPORTED_LANGUAGES, []);

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
    <LanguageContext.Provider
      value={{ language, changeLanguage, getSupportedLanguages }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
