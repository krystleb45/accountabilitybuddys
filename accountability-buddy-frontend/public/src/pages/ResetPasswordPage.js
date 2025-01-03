import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Get the token from the URL parameters
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To navigate to another page after reset
  const errorRef = useRef(null); // For managing focus on error
  const messageRef = useRef(null); // For managing focus on success message

  // Form validation to check if passwords match and meet minimum criteria
  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      errorRef.current.focus();
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      errorRef.current.focus();
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate the form before submission
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', { token, password });

      if (response.data.success) {
        setMessage('Password reset successful! Redirecting to login...');
        messageRef.current.focus();
        setTimeout(() => {
          navigate('/login'); // Redirect to login page
        }, 3000);
      } else {
        setError(response.data.message || 'Password reset failed. Please try again.');
        errorRef.current.focus();
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      errorRef.current.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Reset Password</h1>

      <form onSubmit={handleSubmit} aria-label="Reset Password Form">
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        {error && (
          <div
            className="error-message"
            role="alert"
            style={{ color: 'red', marginBottom: '20px' }}
            ref={errorRef}
            tabIndex="-1"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            className="success-message"
            role="alert"
            style={{ color: 'green', marginBottom: '20px' }}
            ref={messageRef}
            tabIndex="-1"
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '5px',
          }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
