import React from 'react';
import PropTypes from 'prop-types';
import './ProgressTracker.css';

const ProgressTracker = ({ progress, label }) => {
  // Ensure progress is between 0 and 100
  const validProgress = Math.max(0, Math.min(progress, 100));

  return (
    <div className="progress-tracker" role="region" aria-label="Progress Tracker">
      <div
        className="progress-bar-container"
        role="progressbar"
        aria-valuenow={validProgress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label || 'User Progress'}
        tabIndex="0" // Make the progress bar focusable for better accessibility
      >
        <div
          className="progress-bar"
          style={{ width: `${validProgress}%` }}
          aria-hidden="true" // Screen readers will use the outer role="progressbar"
        ></div>
        <span className="progress-label">
          {validProgress}% Complete
        </span>
      </div>
    </div>
  );
};

// PropTypes for ProgressTracker
ProgressTracker.propTypes = {
  progress: PropTypes.number.isRequired,
  label: PropTypes.string,
};

export default ProgressTracker;
