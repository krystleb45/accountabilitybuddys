import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setThemeMode as updateThemeConfig } from '../config/themeConfig';

// Create ThemeSwitcherContext
const ThemeSwitcherContext = createContext();

// Custom hook to use ThemeSwitcherContext
export const useThemeSwitcher = () => useContext(ThemeSwitcherContext);

// Default theme variables
const themes = {
  light: {
    '--background-color': '#ffffff',
    '--text-color': '#000000',
    '--primary-color': '#1976d2',
  },
  dark: {
    '--background-color': '#121212',
    '--text-color': '#ffffff',
    '--primary-color': '#90caf9',
  },
};

// ThemeSwitcherProvider component
export const ThemeSwitcherProvider = ({ children }) => {
  // Initialize theme based on localStorage or system preferences
  const getInitialThemeMode = () => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) return savedTheme;

    // Respect system theme preference if no theme is stored
    const prefersDarkMode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDarkMode ? 'dark' : 'light';
  };

  const [themeMode, setThemeModeState] = useState(getInitialThemeMode);

  // Toggle theme and persist it
  const toggleTheme = useCallback(() => {
    setThemeModeState((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      updateThemeConfig(newMode); // Update themeConfig
      localStorage.setItem('themeMode', newMode); // Save to localStorage
      applyThemeVariables(newMode); // Apply CSS variables
      return newMode;
    });
  }, []);

  // Apply CSS variables for the current theme
  const applyThemeVariables = useCallback((mode) => {
    const themeVariables = themes[mode];
    for (const [key, value] of Object.entries(themeVariables)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, []);

  // Initialize theme on component mount
  useEffect(() => {
    applyThemeVariables(themeMode);

    // Listen for system preference changes
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('themeMode')) {
        const newMode = e.matches ? 'dark' : 'light';
        setThemeModeState(newMode);
        updateThemeConfig(newMode);
        applyThemeVariables(newMode);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themeMode, applyThemeVariables]);

  return (
    <ThemeSwitcherContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeSwitcherContext.Provider>
  );
};

export default ThemeSwitcherContext;
