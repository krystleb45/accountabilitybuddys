import { useState, useEffect, useCallback } from 'react';

/**
 * Type definition for theme.
 */
type ThemeType = 'light' | 'dark' | 'highContrast';

/**
 * Theme configuration object defining CSS variables for each theme.
 */
const themes: Record<ThemeType, Record<string, string>> = {
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

/**
 * Custom hook to manage theme settings.
 *
 * Provides functionality to toggle between themes, persist theme preference,
 * and apply CSS variables dynamically.
 */
const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme && Object.keys(themes).includes(savedTheme)) {
      return savedTheme;
    }

    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    return prefersDarkMode ? 'dark' : 'light';
  });

  // Apply CSS variables for the selected theme
  const applyTheme = useCallback((theme: ThemeType) => {
    const themeVariables = themes[theme];
    Object.entries(themeVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);

  // Toggle between themes
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme: ThemeType =
        prevTheme === 'light'
          ? 'dark'
          : prevTheme === 'dark'
            ? 'highContrast'
            : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  }, [applyTheme]);

  // Apply theme on mount and watch for system preference changes
  useEffect(() => {
    applyTheme(theme);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const systemTheme: ThemeType = e.matches ? 'dark' : 'light';
        setTheme(systemTheme);
        applyTheme(systemTheme);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, applyTheme]);

  return { theme, toggleTheme };
};

export default useTheme;
export type { ThemeType };
