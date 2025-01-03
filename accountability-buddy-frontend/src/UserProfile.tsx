import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useUser } from "../src/context/UserContext"; // Adjust import based on export
import axios from "axios";
import "./UserProfile.css";

interface Gamification {
  points: number;
  level: number;
  badges: string[];
}

interface UserProfileFormData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

const UserProfile: React.FC = () => {
  const { user, refreshUserProfile, loading, error } = useUser();
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<UserProfileFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [gamification, setGamification] = useState<Gamification>({
    points: 0,
    level: 1,
    badges: [],
  });

  useEffect(() => {
    if (user) {
      setUpdatedProfile({ username: user.name, email: user.email });
    }

    const fetchUserGamification = async () => {
      try {
        const response = await axios.get<Gamification>(
          `${process.env.REACT_APP_API_URL}/user/gamification`
        );
        setGamification(response.data);
      } catch (err) {
        console.error("Failed to fetch gamification details:", err);
      }
    };

    fetchUserGamification();
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePicture(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setSuccessMessage("");

    if (updatedProfile.password && updatedProfile.password !== updatedProfile.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", updatedProfile.username);
      formData.append("email", updatedProfile.email);
      if (updatedProfile.password) formData.append("password", updatedProfile.password);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      await axios.post(`${process.env.REACT_APP_API_URL}/user/profile`, formData);
      setSuccessMessage("Profile updated successfully!");
      refreshUserProfile();
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {loading && <p>Loading profile...</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={updatedProfile.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={updatedProfile.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={updatedProfile.password || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={updatedProfile.confirmPassword || ""}
            onChange={handleInputChange}
          />
        </div>
        {passwordError && <p className="error-message">{passwordError}</p>}
        <div>
          <label htmlFor="profilePicture">Profile Picture</label>
          <input type="file" id="profilePicture" onChange={handleProfilePictureChange} />
          {preview && <img src={preview} alt="Profile Preview" />}
        </div>
        <button type="submit">Update Profile</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
      <div className="gamification-section">
        <h3>Gamification</h3>
        <p>Points: {gamification.points}</p>
        <p>Level: {gamification.level}</p>
        <div className="badges">
          {gamification.badges.map((badge, index) => (
            <span key={index} className="badge">
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
