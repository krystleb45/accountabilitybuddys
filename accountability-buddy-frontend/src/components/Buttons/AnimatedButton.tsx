import React from 'react';
import styles from './AnimatedButton.module.css';

interface AnimatedButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string; // Allows additional custom styling
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      className={`${styles['animated-button']} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={isLoading || disabled}
      aria-label={label}
      aria-busy={isLoading}
    >
      {isLoading ? <span className={styles.spinner} /> : label}
    </button>
  );
};

export default AnimatedButton;
