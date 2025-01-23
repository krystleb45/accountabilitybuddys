import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useAuth } from 'src/context/auth/AuthContext';
import styles from './Profile.module.css'; // Adjusted for module CSS usage
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

const Profile: React.FC = (): JSX.Element => {
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

  // Fetch user profile on mount
  useEffect((): void => {
    if (!authToken) {
      setLoading(false); // Skip fetch if not authenticated
      return;
    }

    const fetchProfile = async (): Promise<void> => {
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
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          logout(); // Logout on unauthorized access
        } else {
          setError('Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken, logout]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  // Handle profile picture file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Save profile changes
  const handleSave = async (): Promise<void> => {
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

      setProfile({ ...profile, ...updatedProfile });
      setSuccessMessage('Profile updated successfully!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Safely access the message from AxiosError
        setError(err.response?.data?.message || 'Failed to update profile.');
      } else {
        // Fallback error message for unknown error types
        setError('An unknown error occurred. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.profile}>
      <h2>Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {successMessage && (
            <p className={styles.success} role="alert">
              {successMessage}
            </p>
          )}
          <div className={styles['form-group']}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={updatedProfile.username}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={updatedProfile.email}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.input}
            />
            {preview && (
              <img
                src={preview}
                alt="Profile Preview"
                className={styles['profile-preview']}
              />
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className={styles['save-button']}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
