import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create SettingsContext
export const SettingsContext = createContext();

// Default settings configuration
const defaultSettings = {
  darkMode: false,
  notificationsEnabled: true,
  language: 'en',
  autoSave: false, // Example of an additional setting
};

// Settings Provider component
export const SettingsProvider = ({ children }) => {
  // Load settings from localStorage or use default settings
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      return defaultSettings;
    }
  });

  // Function to validate and update settings
  const updateSettings = useCallback((newSettings) => {
    setSettings((prevSettings) => {
      const updatedSettings = { ...prevSettings, ...newSettings };

      // Validation for settings (e.g., check if language is supported)
      if (updatedSettings.language && !['en', 'es', 'fr'].includes(updatedSettings.language)) {
        console.warn('Unsupported language setting. Reverting to default.');
        updatedSettings.language = defaultSettings.language;
      }

      localStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      return updatedSettings;
    });
  }, []);

  // Reset settings to default values and clear them from localStorage
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('appSettings');
  }, []);

  // Synchronize settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
