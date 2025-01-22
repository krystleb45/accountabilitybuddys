import React from 'react';

interface SimpleComponentProps {
  message?: string;
  className?: string; // Optional className for styling
  id?: string; // Optional ID for DOM targeting
}

const SimpleComponent: React.FC<SimpleComponentProps> = ({
  message = 'Simple Component',
  className = '',
  id = 'simple-component',
}) => {
  return (
    <p
      id={id}
      className={className}
      role="contentinfo"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </p>
  );
};

export default SimpleComponent;
