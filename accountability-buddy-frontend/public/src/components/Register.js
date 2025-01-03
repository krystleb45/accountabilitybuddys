import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate for React Router v6
import { setToken } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state for form submission

  const { username, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);  // Start loading

    // Client-side validation
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      if (res.data.token) {
        setToken(res.data.token);
        navigate('/dashboard');
      } else {
        setError('Registration successful, but no token received.');
      }
    } catch (err) {
      setError(err.response ? err.response.data.msg : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit} aria-live="assertive">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            placeholder="Username"
            required
            aria-label="Username"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            required
            aria-label="Email"
            aria-describedby="emailHelp"
          />
          {error.includes('email') && <p id="emailHelp" style={{ color: 'red' }}>{error}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            required
            aria-label="Password"
            aria-describedby="passwordHelp"
          />
          {error.includes('Password') && <p id="passwordHelp" style={{ color: 'red' }}>{error}</p>}
        </div>
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }} role="alert" aria-live="assertive">{error}</p>}

      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

export default Register;
