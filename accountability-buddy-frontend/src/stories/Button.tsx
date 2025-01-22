import React from 'react';
import './button.css'; // Import styles

// Define the ButtonProps interface for typing
export interface ButtonProps {
  /** Determines if this is the primary call-to-action button */
  primary?: boolean;
  /** Background color of the button */
  backgroundColor?: string;
  /** Size of the button: small, medium, or large */
  size?: 'small' | 'medium' | 'large';
  /** Text displayed on the button */
  label: string;
  /** Callback function triggered when the button is clicked */
  onClick?: () => void;
}

/** 
 * Button Component
 * A reusable button component with primary and secondary styles, customizable size, and colors.
 */
export const Button: React.FC<ButtonProps> = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}) => {
  // Determine the button's mode based on the primary prop
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';

  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={{ backgroundColor }} // Inline style for dynamic background color
      {...props}
    >
      {label}
    </button>
  );
};
