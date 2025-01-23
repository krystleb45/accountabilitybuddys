import React, { useState } from 'react';
import axios from 'axios';
import styles from './Forms.module.css'; // Import CSS module for styling

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Function to validate the email address format
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage(''); // Clear previous message
    setError(''); // Clear previous error

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false); // Stop loading since validation failed
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
        { email }
      );
      setMessage(
        res.data.message ||
          'Password reset instructions have been sent to your email.'
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            'Failed to send password reset instructions. Please try again.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className={styles['form-container']}>
      <h2>Forgot Password</h2>
      {message && <p className={styles['success-message']}>{message}</p>}
      {error && <p className={styles['error-message']}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles['form']}>
        <label htmlFor="email" className={styles['label']}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={styles['input']}
          aria-label="Email"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={styles['submit-button']}
        >
          {loading ? 'Sending...' : 'Send Instructions'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
