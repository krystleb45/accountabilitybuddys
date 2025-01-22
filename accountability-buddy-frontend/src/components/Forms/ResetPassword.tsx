import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Forms.module.css'; // Import CSS module for styling

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const validatePassword = (password: string): boolean => {
    const minLength = 8; // Password must be at least 8 characters
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= minLength && hasUpperCase && hasNumber;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters long, include a number, and an uppercase letter.'
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(
        err.response?.data?.message ||
          'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['form-container']}>
      <h2 className={styles['form-title']}>Reset Password</h2>
      {message && <p className={styles['success-message']}>{message}</p>}
      {error && <p className={styles['error-message']}>{error}</p>}
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
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
