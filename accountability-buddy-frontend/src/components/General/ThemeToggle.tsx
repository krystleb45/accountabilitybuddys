import React from 'react';
import { useTheme } from 'src/context/ui/ThemeContext'; // Use the custom hook for ThemeContext
import './ThemeToggle.css';
import { ThemeToggleProps } from '.';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  const { theme, toggleTheme } = useTheme();
  interface ThemeToggleProps {
    isDarkMode: boolean;
    onToggle: () => void;
  }
  return (
    <div className="theme-toggle" data-testid="theme-toggle">
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        aria-pressed={theme === 'dark'} // Accessibility: indicates the current state
        role="button" // Role for accessibility
        className={`theme-toggle-button ${theme === 'dark' ? 'dark' : 'light'}`}
        data-testid="theme-toggle-button"
      >
        {theme === 'dark' ? (
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
        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  );
};

export default ThemeToggle;
