import React from "react";
import PropTypes from "prop-types";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = 50, color = "#007bff", loading = true }) => {
  if (!loading) return null; // Don't render if loading is false

  return (
    <div
      className="spinner-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="loading-spinner"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: `${color} transparent ${color} transparent`,
        }}
      ></div>
      <span className="sr-only">Loading...</span> {/* Screen reader accessible text */}
    </div>
  );
};

// Prop validation
LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  loading: PropTypes.bool,
};

export default LoadingSpinner;
