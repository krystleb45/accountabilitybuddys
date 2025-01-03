import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Check if email is valid
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Send password reset request to server
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message || 'Password reset email sent successfully.');
    } catch (err) {
      console.error('Failed to send password reset email:', err);
      setError('An error occurred while sending the reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Forgot Password</h1>
      <p>Enter your email to receive a password reset link.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />
        </div>

        {error && (
          <div className="error-message" role="alert" style={{ color: 'red', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {message && (
          <div className="success-message" role="alert" style={{ color: 'green', marginBottom: '20px' }}>
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
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
