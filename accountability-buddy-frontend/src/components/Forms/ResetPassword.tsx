import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Forms.module.css'; // Import CSS module for styling

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Retrieve reset token from URL
  const [password, setPassword] = useState<string>(''); // State for new password
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // State for confirming password
  const [message, setMessage] = useState<string>(''); // Success message
  const [error, setError] = useState<string>(''); // Error message
  const [loading, setLoading] = useState<boolean>(false); // Loading indicator
  const navigate = useNavigate(); // Navigation hook

  // Validate the password for minimum requirements
  const validatePassword = (password: string): boolean => {
    const minLength = 8; // At least 8 characters
    const hasUpperCase = /[A-Z]/.test(password); // At least one uppercase letter
    const hasNumber = /[0-9]/.test(password); // At least one number
    return password.length >= minLength && hasUpperCase && hasNumber;
  };

  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage(''); // Clear any previous success messages
    setError(''); // Clear any previous error messages

    // Validate password requirements
    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters long, include a number, and an uppercase letter.'
      );
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      // Send reset password request to the API
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    } catch (err: unknown) {
      console.error('Error resetting password:', err);
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              'Failed to reset password. Please try again.'
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <div className={styles['form-container']}>
      <h2 className={styles['form-title']}>Reset Password</h2>
      {message && (
        <p className={styles['success-message']} role="status">
          {message}
        </p>
      )}
      {error && (
        <p className={styles['error-message']} role="alert">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className={styles['form']}>
        <label htmlFor="password" className={styles['label']}>
          New Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles['input']}
          aria-label="New Password"
          required
          minLength={8}
        />
        <label htmlFor="confirmPassword" className={styles['label']}>
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles['input']}
          aria-label="Confirm New Password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={styles['submit-button']}
          aria-busy={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
