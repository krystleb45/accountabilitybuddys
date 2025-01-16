import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import your custom hook

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
  const { authToken, logout } = useAuth(); // Use the custom hook to get authToken and logout
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    email: "",
    subscriptionStatus: "",
  });
  const [updatedProfile, setUpdatedProfile] = useState<UpdatedProfileData>({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setProfile(response.data);
        setUpdatedProfile({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (err: any) { // Specify the type as 'any' to avoid TypeScript errors
        setError("Failed to load profile. Please try again.");
        if (err.response && err.response.status === 401) {
          logout(); // Call logout if the token is invalid
        }
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchProfile(); // Fetch profile only if authToken exists
    } else {
      setLoading(false); // If no authToken, stop loading
    }
  }, [authToken, logout]); // Add logout to dependencies to avoid stale closure

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
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("username", updatedProfile.username);
      formData.append("email", updatedProfile.email);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await axios.put(`${process.env.REACT_APP_API_URL}/users/profile`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setSuccessMessage("Profile updated successfully!");
      setProfile({ ...profile, ...updatedProfile });
    } catch (err: any) { // Specify the type as 'any' to avoid TypeScript errors
      setError("Failed to update profile. Please try again.");
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
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <input
            type="text"
            name="username"
            value={updatedProfile.username}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            value={updatedProfile.email}
            onChange={handleInputChange}
          />
          <input type="file" onChange={handleFileChange} />
          {preview && <img src={preview} alt="Profile Preview" />}
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
