// mockThemeProvider.tsx

import React, { createContext, ReactNode } from "react";
import { Theme } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Mock Theme Context shape
interface MockThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create mock theme
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    secondary: { main: "#f48fb1" },
  },
});

const mockThemeContext: MockThemeContextType = {
  theme: lightTheme,
  toggleTheme: jest.fn(),
};

// Create a context for mock theme
const MockThemeContext = createContext<MockThemeContextType>(mockThemeContext);

// MockThemeProvider props
interface MockThemeProviderProps {
  children: ReactNode;
  customValues?: Partial<MockThemeContextType>;
}

// MockThemeProvider component
export const MockThemeProvider: React.FC<MockThemeProviderProps> = ({
  children,
  customValues,
}) => {
  // Combine customValues with the default mock context
  const mergedContext = { ...mockThemeContext, ...customValues };

  return (
    <MockThemeContext.Provider value={mergedContext}>
      <ThemeProvider theme={mergedContext.theme}>{children}</ThemeProvider>
    </MockThemeContext.Provider>
  );
};

// Utility hook to use MockThemeContext in tests
export const useMockTheme = (): MockThemeContextType => {
  const context = React.useContext(MockThemeContext);
  if (!context) {
    throw new Error("useMockTheme must be used within a MockThemeProvider");
  }
  return context;
};

export default MockThemeProvider;