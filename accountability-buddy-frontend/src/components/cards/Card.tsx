import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  /** Content inside the card */
  children: React.ReactNode;
  /** Optional custom styles for the card */
  className?: string;
  /** Optional click handler for interactive cards */
  onClick?: () => void;
  /** Optional flag to make the card appear elevated */
  elevated?: boolean;
  /** Optional flag to apply a border */
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  elevated = false,
  bordered = false,
}) => {
  // Combine class names dynamically
  const cardClassNames = [
    styles.card,
    elevated ? styles.elevated : '',
    bordered ? styles.bordered : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClassNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined} // Make card focusable if clickable
      aria-pressed={onClick ? 'false' : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
