import React from 'react';
import { useTheme } from 'src/context/ui/ThemeContext'; // Use the custom hook for ThemeContext
import './ThemeToggle.css';

// Define the props for the ThemeToggle component
export interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  const { theme, toggleTheme } = useTheme();

  // Use the theme value here
  console.log(theme);

  const handleToggle = (): void => {
    onToggle();
    toggleTheme();
  };

  return (
    <div className="theme-toggle" data-testid="theme-toggle">
      <button
        onClick={handleToggle}
        aria-label="Toggle theme"
        aria-pressed={isDarkMode} // Use isDarkMode to determine the current state
        className={`theme-toggle-button ${isDarkMode ? 'dark' : 'light'}`}
        data-testid="theme-toggle-button"
      >
        {isDarkMode ? (
          <span
            data-testid="dark-mode-icon"
            className="theme-icon"
            aria-hidden="true"
          >
            🌙
          </span>
        ) : (
          <span
            data-testid="light-mode-icon"
            className="theme-icon"
            aria-hidden="true"
          >
            ☀️
          </span>
        )}
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  );
};

export default ThemeToggle;
