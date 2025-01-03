import React from "react";
import "./AnimatedButton.css";

// Define the props interface
interface AnimatedButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
}) => {
  return (
    <button
      className={`animated-button ${variant} ${size}`}
      onClick={onClick}
      disabled={isLoading || disabled}
      aria-label={label}
      aria-busy={isLoading}
    >
      {isLoading ? <span className="spinner" /> : label}
    </button>
  );
};

export default AnimatedButton;
