import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  ReactNode,
} from "react";

// Define the theme types
type ThemeType = "light" | "dark" | "highContrast";

// Define the structure of the ThemeContext
interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

// Default themes configuration with high-contrast support
const themes: Record<ThemeType, Record<string, string>> = {
  light: {
    "--background-color": "#ffffff",
    "--text-color": "#000000",
    "--primary-color": "#1976d2",
  },
  dark: {
    "--background-color": "#121212",
    "--text-color": "#ffffff",
    "--primary-color": "#90caf9",
  },
  highContrast: {
    "--background-color": "#000000",
    "--text-color": "#ffcc00",
    "--primary-color": "#ff3300",
  },
};

// Create ThemeContext
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// Helper function to manage the initial theme
const getInitialTheme = (): ThemeType => {
  const savedTheme = localStorage.getItem("theme") as ThemeType;
  if (savedTheme && Object.keys(themes).includes(savedTheme)) return savedTheme;

  // Respect system theme preference if no theme is stored
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDarkMode ? "dark" : "light";
};

// Custom hook to use the ThemeContext
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);

  // Apply CSS variables for the current theme
  const applyThemeVariables = useCallback((theme: ThemeType) => {
    const themeVariables = themes[theme];
    Object.entries(themeVariables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);

  // Toggle theme and save preference
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme: ThemeType =
        prevTheme === "light"
          ? "dark"
          : prevTheme === "dark"
          ? "highContrast"
          : "light";
      localStorage.setItem("theme", newTheme);
      applyThemeVariables(newTheme);
      return newTheme;
    });
  }, [applyThemeVariables]);

  // Apply theme on component mount
  useEffect(() => {
    applyThemeVariables(theme);

    // Listen for system preference changes
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        const systemTheme: ThemeType = e.matches ? "dark" : "light";
        setTheme(systemTheme);
        applyThemeVariables(systemTheme);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [theme, applyThemeVariables]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
