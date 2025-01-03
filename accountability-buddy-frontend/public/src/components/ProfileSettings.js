import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ProfileSettings.css'; // Optional CSS for styling

const ProfileSettings = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Call the update function with new data
    onUpdate(formData);
    setSuccess('Profile updated successfully!');
  };

  return (
    <div className="profile-settings" role="region" aria-live="polite">
      <h2>Profile Settings</h2>
      {error && (
        <p className="error-message" role="alert" aria-live="assertive">
          {error}
        </p>
      )}
      {success && (
        <p className="success-message" role="alert" aria-live="polite">
          {success}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-label="Name"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-label="Email"
          />
        </div>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            aria-label="New password"
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            aria-label="Confirm new password"
            placeholder="Confirm new password"
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

ProfileSettings.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ProfileSettings;
