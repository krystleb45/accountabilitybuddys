import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import i18n from "../config/i18n";

// Define the shape of the LanguageContext
interface LanguageContextType {
  language: string;
  changeLanguage: (lng: string) => void;
}

// Create Language Context with the appropriate type
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Custom hook to use LanguageContext
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// LanguageProvider component props
interface LanguageProviderProps {
  children: ReactNode;
}

// Language Context Provider
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    // Check for saved language or detect from browser
    return (
      localStorage.getItem("language") ||
      navigator.language.split("-")[0] ||
      "en"
    );
  });

  // Change language and persist the preference
  const changeLanguage = useCallback((lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  }, []);

  // Update i18n when language changes
  useEffect(() => {
    try {
      i18n.changeLanguage(language);
      localStorage.setItem("language", language);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
