import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';  // Import the ThemeContext
import './ThemeToggle.css';  // Optional CSS file for styling the toggle

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);  // Get the current theme and toggle function from context

  return (
    <div className="theme-toggle">
      <label className="switch">
        <input
          type="checkbox"
          onChange={toggleTheme}
          checked={theme === 'dark'}  // The toggle is checked if the theme is dark
          aria-checked={theme === 'dark'}  // ARIA attribute for accessibility
          aria-label="Toggle dark mode"  // ARIA label for screen readers
          role="switch"  // Switch role for accessibility
          tabIndex={0}  // Allow focus for keyboard navigation
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleTheme();  // Toggle theme on 'Enter' or 'Space' key press
            }
          }}
        />
        <span className="slider round"></span>
      </label>
      <span className="theme-label">
        {theme === 'light' ? 'Light Mode' : 'Dark Mode'}  {/* Display the current mode */}
      </span>
    </div>
  );
};

export default ThemeToggle;
