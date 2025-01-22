import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      if (response.data.success) {
        setSuccess('Password reset link has been sent to your email.');
        setTimeout(() => navigate('/login'), 5000); // Redirect to login after 5 seconds
      } else {
        setError(response.data.message || 'Failed to send reset link.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'An error occurred. Please try again later.'
      );
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" className="submit-button">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
