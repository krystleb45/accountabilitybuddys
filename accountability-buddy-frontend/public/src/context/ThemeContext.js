import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

// Default themes configuration with high-contrast support
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
  highContrast: {
    '--background-color': '#000000',
    '--text-color': '#ffcc00',
    '--primary-color': '#ff3300',
  },
};

// Create Theme Context
const ThemeContext = createContext();

// Helper function to manage initial theme
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;

  // Respect system theme preference if no theme is stored
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDarkMode ? 'dark' : 'light';
};

// Custom hook to use the theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Theme Provider component
export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Toggle theme and save preference
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : prevTheme === 'dark' ? 'highContrast' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  // Apply theme class and CSS variables to the body element
  useEffect(() => {
    // Remove previous theme class and add the new one
    document.body.classList.remove('light', 'dark', 'highContrast');
    document.body.classList.add(theme);

    // Apply CSS variables based on the current theme
    const themeVariables = themes[theme];
    for (const [key, value] of Object.entries(themeVariables)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, [theme]);

  // Listen for system preference changes and update theme accordingly
  useEffect(() => {
    const handleSystemThemeChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
