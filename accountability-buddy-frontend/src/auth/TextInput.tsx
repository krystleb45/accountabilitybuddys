// TextInput.tsx

import React from 'react';

type TextInputProps = {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  className?: string;
  error?: string;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder = '',
  id,
  className = '',
  error = '',
}) => {
  return (
    <div className={`text-input-container ${className}`}>
      <label htmlFor={id} className="text-input-label">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`text-input ${error ? 'input-error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="error-message">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
