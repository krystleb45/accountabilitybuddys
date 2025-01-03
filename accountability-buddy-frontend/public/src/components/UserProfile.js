import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const { user, refreshUserProfile, loading, error } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [gamification, setGamification] = useState({ points: 0, level: 1, badges: [] });

  useEffect(() => {
    if (user) {
      setUpdatedProfile({ username: user.username, email: user.email });
    }

    const fetchUserGamification = async () => {
      try {
        const response = await axios.get(`/api/gamification/user/${user._id}`);
        setGamification(response.data);
      } catch (err) {
        console.error('Error fetching gamification data:', err);
      }
    };

    if (user && user._id) {
      fetchUserGamification();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMessage('');

    if (updatedProfile.password && updatedProfile.password !== updatedProfile.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (updatedProfile.password && !validatePasswordStrength(updatedProfile.password)) {
      setPasswordError('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', updatedProfile.username);
      formData.append('email', updatedProfile.email);
      if (updatedProfile.password) formData.append('password', updatedProfile.password);
      if (profilePicture) formData.append('profilePicture', profilePicture);

      await axios.put(`/api/users/${user._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      refreshUserProfile();
      setSuccessMessage('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setPasswordError('Failed to update profile. Please try again.');
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="user-profile-container" role="region" aria-live="polite">
      <h2>User Profile</h2>
      {error && <p className="error-message" role="alert">{error}</p>}
      {successMessage && <p className="success-message" role="alert">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={updatedProfile.username}
            onChange={handleInputChange}
            required
            aria-label="Username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={updatedProfile.email}
            onChange={handleInputChange}
            required
            aria-label="Email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input type="file" id="profilePicture" onChange={handleFileChange} aria-label="Profile Picture" />
          {preview && <img src={preview} alt="Profile preview" className="profile-preview" />}
        </div>

        {editing && (
          <>
            <div className="form-group">
              <label htmlFor="password">New Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                value={updatedProfile.password}
                onChange={handleInputChange}
                placeholder="Enter a new password"
                aria-label="New password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={updatedProfile.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                aria-label="Confirm password"
              />
            </div>

            {passwordError && <p className="error-message" role="alert">{passwordError}</p>}
          </>
        )}

        <div className="form-actions">
          {editing ? (
            <>
              <button type="submit" className="save-button" aria-label="Save profile changes">Save</button>
              <button type="button" onClick={() => setEditing(false)} className="cancel-button" aria-label="Cancel editing">Cancel</button>
            </>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="edit-button" aria-label="Edit profile">Edit Profile</button>
          )}
        </div>
      </form>

      <div className="gamification-section">
        <h3>Your Gamification Status</h3>
        <p>Level: {gamification.level}</p>
        <p>Points: {gamification.points}</p>
        <div>
          <h4>Badges</h4>
          <ul>
            {gamification.badges.map((badge, index) => (
              <li key={index}>{badge}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
