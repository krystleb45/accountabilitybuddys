import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { username, email, password, confirmPassword, interests } = formData;

  // Handle form input changes
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Validate form fields
  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword || !interests) {
      setError('All fields are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Send registration request to server
      const response = await axios.post('/api/auth/register', formData);
      if (response.data.success) {
        setSuccessMessage('Registration successful! Please check your email to verify your account.');
        setFormData({ username: '', email: '', password: '', confirmPassword: '', interests: '' });
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page" style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            required
            aria-required="true"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            aria-required="true"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            aria-required="true"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            aria-required="true"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="interests">Interests:</label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={interests}
            onChange={onChange}
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

        {successMessage && (
          <div className="success-message" role="alert" style={{ color: 'green', marginBottom: '20px' }}>
            {successMessage}
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
