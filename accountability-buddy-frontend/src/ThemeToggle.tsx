import React from "react";
import { useTheme } from "../src/context/ThemeContext"; // Use the custom hook for ThemeContext
import "./ThemeToggle.css";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <label className="switch">
        <input
          type="checkbox"
          onChange={toggleTheme}
          checked={theme === "dark"} // Checked if the theme is dark
          aria-checked={theme === "dark"} // ARIA attribute for accessibility
          aria-label="Toggle dark mode" // ARIA label for screen readers
          role="switch" // Switch role for accessibility
          tabIndex={0} // Allow focus for keyboard navigation
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              toggleTheme(); // Toggle theme on 'Enter' or 'Space' key press
            }
          }}
        />
        <span className="slider"></span> {/* Custom slider element */}
      </label>
    </div>
  );
};

export default ThemeToggle;
