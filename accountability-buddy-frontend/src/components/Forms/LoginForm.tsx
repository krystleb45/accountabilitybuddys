import React, { useState } from 'react';
import styles from './Forms.module.css'; // Import CSS module for styling
import { validateEmail } from './FormsUtils'; // Reuse email validation utility

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Call onSubmit with the valid data
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles['form']}>
      <h2 className={styles['form-title']}>Login</h2>
      {error && <p className={styles['error-message']}>{error}</p>}
      <label htmlFor="email" className={styles['label']}>
        Email Address
      </label>
      <input
        type="email"
        id="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles['input']}
        aria-label="Email"
        required
      />
      <label htmlFor="password" className={styles['label']}>
        Password
      </label>
      <input
        type="password"
        id="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles['input']}
        aria-label="Password"
        required
      />
      <button type="submit" className={styles['submit-button']}>
        Submit
      </button>
    </form>
  );
};

export default LoginForm;
