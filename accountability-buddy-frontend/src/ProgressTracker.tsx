import React from "react";
import "./ProgressTracker.css"; // Adjust if using CSS modules: import styles from "./ProgressTracker.module.css";

interface ProgressTrackerProps {
  progress: number; // Progress value, expected between 0 and 100
  label?: string; // Optional label for the progress bar
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress, label = "User Progress" }) => {
  // Ensure progress is clamped between 0 and 100
  const validProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div
      className="progress-tracker"
      role="region"
      aria-labelledby="progress-tracker-label"
    >
      <div
        id="progress-tracker-label"
        className="progress-bar-container"
        role="progressbar"
        aria-valuenow={validProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        tabIndex={0} // Make the progress bar focusable for better accessibility
      >
        <div
          className="progress-bar"
          style={{ width: `${validProgress}%` }}
          aria-hidden="true" // Hide this element from screen readers
        ></div>
        <span className="progress-label">{validProgress}% Complete</span>
      </div>
    </div>
  );
};

export default ProgressTracker;
