import React from 'react';
import PropTypes from 'prop-types';
import './AnimatedButton.css';

const AnimatedButton = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  isLoading = false, 
  disabled = false 
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

// PropTypes for AnimatedButton
AnimatedButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool
};

export default AnimatedButton;
