import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { authToken, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({ username: '', email: '', subscriptionStatus: '' });
  const [updatedProfile, setUpdatedProfile] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null); // For profile picture preview

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setProfile(response.data);
        setUpdatedProfile({ username: response.data.username, email: response.data.email });
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authToken]);

  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    // Validate file type (only allow image formats)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only images are allowed.');
      return;
    }
    
    // Validate file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size exceeds the limit of 2MB.');
      return;
    }
    
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
    useEffect(() => {
      return () => {
        if (preview) {
          URL.revokeObjectURL(preview); // Clean up the object URL
        }
      };
    }, [preview]);
    
  };
  

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    // Basic client-side validation for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedProfile.email)) {
      setError('Please enter a valid email address.');
      setSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append('username', updatedProfile.username);
    formData.append('email', updatedProfile.email);
    if (profilePicture) formData.append('profilePicture', profilePicture);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/profile/update`,
        formData,
        { headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'multipart/form-data' } }
      );
      setProfile(response.data); // Optimistically update the profile
      setSuccessMessage('Profile updated successfully!');
      setSaving(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setSaving(false);
    }
  };

  const handleLogout = () => logout();

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }} role="alert" aria-live="assertive">{error}</p>}
      {successMessage && <p style={{ color: 'green' }} aria-live="polite">{successMessage}</p>}

      <form onSubmit={handleSave}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={updatedProfile.username}
            onChange={handleChange}
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
            value={updatedProfile.email}
            onChange={handleChange}
            required
            aria-label="Email"
          />
        </div>
        <div>
          <label htmlFor="profilePicture">Profile Picture:</label>
          <input type="file" id="profilePicture" name="profilePicture" onChange={handleFileUpload} />
          {preview && <img src={preview} alt="Profile Preview" width="100" height="100" />}
        </div>
        <button type="submit" disabled={saving} aria-busy={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      <p><strong>Subscription Status:</strong> {profile.subscriptionStatus || 'Free'}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
