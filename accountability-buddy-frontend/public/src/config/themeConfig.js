import { createTheme } from '@mui/material/styles';
import { responsiveFontSizes } from '@mui/material';
import { createContext, useState, useContext, useEffect } from 'react';

// Define light, dark, and high-contrast theme palettes
const lightPalette = {
  primary: { main: '#1976d2', contrastText: '#ffffff' },
  secondary: { main: '#dc004e', contrastText: '#ffffff' },
  background: { default: '#f4f6f8', paper: '#ffffff' },
  text: { primary: '#000000', secondary: '#555555' },
};

const darkPalette = {
  primary: { main: '#90caf9', contrastText: '#000000' },
  secondary: { main: '#f48fb1', contrastText: '#000000' },
  background: { default: '#121212', paper: '#1d1d1d' },
  text: { primary: '#ffffff', secondary: '#bbbbbb' },
};

const highContrastPalette = {
  primary: { main: '#ffcc00', contrastText: '#000000' },
  secondary: { main: '#ff3300', contrastText: '#000000' },
  background: { default: '#000000', paper: '#000000' },
  text: { primary: '#ffffff', secondary: '#ffcc00' },
};

// Default theme mode
const defaultThemeMode = 'light';

// Utility to get theme mode from local storage or use the default
const getThemeMode = () => localStorage.getItem('themeMode') || defaultThemeMode;

// Utility to set theme mode in local storage
export const setThemeMode = (mode) => {
  localStorage.setItem('themeMode', mode);
};

// Create theme based on the selected mode
const createAppTheme = (mode) => {
  const palette =
    mode === 'dark'
      ? darkPalette
      : mode === 'high-contrast'
      ? highContrastPalette
      : lightPalette;

  let theme = createTheme({
    palette,
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: 14,
      h1: { fontSize: '2.5rem' },
      h2: { fontSize: '2rem' },
      h3: { fontSize: '1.75rem' },
      h4: { fontSize: '1.5rem' },
      h5: { fontSize: '1.25rem' },
      h6: { fontSize: '1rem' },
      body1: { fontSize: '1rem' },
      body2: { fontSize: '0.875rem' },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            padding: 16,
          },
        },
      },
    },
  });

  // Make typography responsive
  theme = responsiveFontSizes(theme);

  return theme;
};

// Theme Context for managing theme globally
const ThemeContext = createContext();

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeModeState] = useState(getThemeMode());

  useEffect(() => {
    // Listen for theme changes and update local storage
    setThemeMode(themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeModeState((prevMode) =>
      prevMode === 'light' ? 'dark' : prevMode === 'dark' ? 'high-contrast' : 'light'
    );
  };

  const theme = createAppTheme(themeMode);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);

export default createAppTheme(getThemeMode());
