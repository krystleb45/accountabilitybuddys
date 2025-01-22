import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from 'src/context/auth/AuthContext';
import './Profile.module.css';
import { validateEmail, formatUserName } from 'src/utils/utility-functions';

interface ProfileData {
  username: string;
  email: string;
  subscriptionStatus: string;
}

interface UpdatedProfileData {
  username: string;
  email: string;
}

const Profile: React.FC = () => {
  const { authToken, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    email: '',
    subscriptionStatus: '',
  });
  const [updatedProfile, setUpdatedProfile] = useState<UpdatedProfileData>({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setProfile(response.data);
        setUpdatedProfile({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (err: any) {
        setError('Failed to load profile. Please try again.');
        if (err.response && err.response.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [authToken, logout]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccessMessage('');

    if (!validateEmail(updatedProfile.email)) {
      setError('Invalid email address.');
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', formatUserName(updatedProfile.username));
      formData.append('email', updatedProfile.email);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setSuccessMessage('Profile updated successfully!');
      setProfile({ ...profile, ...updatedProfile });
    } catch (err: any) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="success" role="alert">
              {successMessage}
            </p>
          )}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={updatedProfile.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={updatedProfile.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              onChange={handleFileChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className="profile-preview"
              />
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="save-button"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
