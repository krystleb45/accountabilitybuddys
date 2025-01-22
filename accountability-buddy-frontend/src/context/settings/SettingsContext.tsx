import React, { createContext, useState, useEffect, useCallback, ReactNode } from "react";

// Define the shape of the settings
interface Settings {
  darkMode: boolean;
  notificationsEnabled: boolean;
  language: string;
  autoSave: boolean;
  saveFrequency: number; // New feature: save frequency in minutes
}

// Define the shape of the SettingsContext
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  toggleDarkMode: () => void;
  enableNotifications: (enabled: boolean) => void;
}

// Create SettingsContext with the appropriate type
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Default settings configuration
const defaultSettings: Settings = {
  darkMode: false,
  notificationsEnabled: true,
  language: "en",
  autoSave: false,
  saveFrequency: 10, // Default to 10 minutes
};

// SettingsProvider component props
interface SettingsProviderProps {
  children: ReactNode;
}

// Settings Provider component
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Load settings from localStorage or use default settings
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const savedSettings = localStorage.getItem("appSettings");
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error);
      return defaultSettings;
    }
  });

  // Function to validate and update settings
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings, ...newSettings };

      // Validation for settings (e.g., check if language is supported)
      if (
        updatedSettings.language &&
        !["en", "es", "fr", "de", "zh", "ar"].includes(updatedSettings.language)
      ) {
        console.warn("Unsupported language setting. Reverting to default.");
        updatedSettings.language = defaultSettings.language;
      }

      if (updatedSettings.saveFrequency < 1 || updatedSettings.saveFrequency > 60) {
        console.warn("Save frequency must be between 1 and 60 minutes. Reverting to default.");
        updatedSettings.saveFrequency = defaultSettings.saveFrequency;
      }

      localStorage.setItem("appSettings", JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  }, []);

  // Reset settings to default values and clear them from localStorage
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem("appSettings");
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    updateSettings({ darkMode: !settings.darkMode });
  }, [settings.darkMode, updateSettings]);

  // Enable or disable notifications
  const enableNotifications = useCallback(
    (enabled: boolean) => {
      updateSettings({ notificationsEnabled: enabled });
    },
    [updateSettings]
  );

  // Synchronize settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error);
    }
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings, toggleDarkMode, enableNotifications }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;