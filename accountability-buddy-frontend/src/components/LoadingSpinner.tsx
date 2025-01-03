import React from "react";
import "../../src/components/LoadingSpinner"; // Import the CSS file for styling

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  loading?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 50,
  color = "#007bff",
  loading = true,
}) => {
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

export default LoadingSpinner;
