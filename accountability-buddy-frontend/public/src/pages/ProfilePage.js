import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    subscriptionStatus: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('https://accountabilitybuddys.com/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(res.data);
        setUpdatedProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes for the profile form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile({ ...updatedProfile, [name]: value });
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await axios.put('https://accountabilitybuddys.com/api/users/profile', updatedProfile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (res.data.success) {
        setProfile(updatedProfile);
        setSuccessMessage('Profile updated successfully!');
        setEditing(false);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('An error occurred while updating the profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>My Profile</h1>

      {loading && <p>Loading...</p>}

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

      {!loading && !editing && (
        <div className="profile-details">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Subscription Status:</strong> {profile.subscriptionStatus}</p>
          <button
            onClick={() => setEditing(true)}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Edit Profile
          </button>
        </div>
      )}

      {!loading && editing && (
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={updatedProfile.username}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '10px', margin: '5px 0' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={updatedProfile.email}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '10px', margin: '5px 0' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => setEditing(false)}
            style={{
              padding: '10px 20px',
              marginLeft: '10px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
