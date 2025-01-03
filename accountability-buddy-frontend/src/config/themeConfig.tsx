import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { createTheme, Theme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { responsiveFontSizes } from "@mui/material";

// Define light, dark, and high-contrast theme palettes
const lightPalette = {
  primary: { main: "#1976d2", contrastText: "#ffffff" },
  secondary: { main: "#dc004e", contrastText: "#ffffff" },
  background: { default: "#f4f6f8", paper: "#ffffff" },
  text: { primary: "#000000", secondary: "#555555" },
};

const darkPalette = {
  primary: { main: "#90caf9", contrastText: "#000000" },
  secondary: { main: "#f48fb1", contrastText: "#000000" },
  background: { default: "#121212", paper: "#1d1d1d" },
  text: { primary: "#ffffff", secondary: "#bbbbbb" },
};

const highContrastPalette = {
  primary: { main: "#ffcc00", contrastText: "#000000" },
  secondary: { main: "#ff3300", contrastText: "#000000" },
  background: { default: "#000000", paper: "#000000" },
  text: { primary: "#ffffff", secondary: "#ffcc00" },
};

// Default theme mode
const defaultThemeMode = "light";

// Utility to get theme mode from local storage or use the default
const getThemeMode = (): string => localStorage.getItem("themeMode") || defaultThemeMode;

// Utility to set theme mode in local storage
const setThemeModeInStorage = (mode: string): void => {
  localStorage.setItem("themeMode", mode);
};

// Function to create the app theme
const createAppTheme = (mode: string): Theme => {
  const palette =
    mode === "dark"
      ? darkPalette
      : mode === "high-contrast"
      ? highContrastPalette
      : lightPalette;

  let theme = createTheme({
    palette,
    typography: { fontFamily: "Roboto, Arial, sans-serif" },
  });
  return responsiveFontSizes(theme);
};

// Theme Context for managing theme globally
interface ThemeContextType {
  themeMode: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider component
const CustomThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<string>(getThemeMode());

  useEffect(() => {
    setThemeModeInStorage(themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => {
      if (prevMode === "light") return "dark";
      else if (prevMode === "dark") return "high-contrast";
      return "light";
    });
  };

  const theme = createAppTheme(themeMode);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export { CustomThemeProvider, ThemeContext };
export default createAppTheme;
