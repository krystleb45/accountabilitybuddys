import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { UserContext } from '../context/UserContext';
import { updateSettings } from '../services/settingsService';

const SettingsPage = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, refreshUserProfile } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    notifications: user?.notifications || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { username, email, notifications } = formData;

  useEffect(() => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      notifications: user?.notifications || false,
    });
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  // Validate email format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle form validation
  const validateForm = () => {
    if (!username) {
      setError('Username is required.');
      return false;
    }
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await updateSettings(formData);

      if (response.success) {
        setSuccessMessage('Settings updated successfully!');
        refreshUserProfile(); // Refresh user context
      } else {
        setError('Failed to update settings. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Settings</h1>

      <form onSubmit={handleSubmit} aria-label="User Settings Form">
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="notifications">Enable Notifications:</label>
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={notifications}
            onChange={handleChange}
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
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <div className="theme-toggle" style={{ marginTop: '20px' }}>
          <p>Current Theme: {theme}</p>
          <button type="button" onClick={toggleTheme}>
            Toggle Theme
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
