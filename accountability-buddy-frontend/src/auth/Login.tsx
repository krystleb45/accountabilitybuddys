import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token); // Save token in localStorage
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'An error occurred. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="redirect-message">
        Don’t have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;
