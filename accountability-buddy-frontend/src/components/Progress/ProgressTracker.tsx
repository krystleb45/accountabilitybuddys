import React from 'react';
import './ProgressTracker.module.css';

interface ProgressTrackerProps {
  progress: number;
  label?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  label,
}) => {
  // Ensure progress is between 0 and 100
  const validProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div
      className="progress-tracker"
      role="region"
      aria-label="Progress Tracker"
      aria-labelledby="progress-tracker-label"
    >
      <div
        className="progress-bar-container"
        role="progressbar"
        aria-valuenow={validProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'User Progress'}
        tabIndex={0} // Make the progress bar focusable for better accessibility
      >
        <div
          className="progress-bar"
          style={{ width: `${validProgress}%` }}
          aria-hidden="true" // Screen readers will use the outer role="progressbar"
        ></div>
        <span
          id="progress-tracker-label"
          className="progress-label"
          aria-live="polite"
        >
          {label || 'User Progress'}: {validProgress}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProgressTracker;
