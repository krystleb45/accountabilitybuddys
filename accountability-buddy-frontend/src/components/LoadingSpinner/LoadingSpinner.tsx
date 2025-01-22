import React from "react";
import "./LoadingSpinner.css"; // Ensure this path is correct or adjust as needed

interface LoadingSpinnerProps {
  size?: number; // Spinner size in pixels
  color?: string; // Spinner color
  loading?: boolean; // Whether the spinner is visible
  overlay?: boolean; // Optionally render an overlay
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 50,
  color = "#007bff",
  loading = true,
  overlay = false,
}) => {
  if (!loading) return null; // Do not render if loading is false

  return (
    <div
      className={overlay ? "spinner-overlay" : ""}
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid="loading-spinner"
    >
      <div
        className="loading-spinner"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderWidth: `${size / 10}px`,
          borderColor: `${color} transparent transparent transparent`,
        }}
      />
      <span className="sr-only">Loading...</span> {/* Accessible loading text */}
    </div>
  );
};

export default LoadingSpinner;
