import React, { useState, useEffect } from "react";
import useUser from "../hooks/useUser";
import axios from "axios";
import "./UserProfile.css";

interface Gamification {
  points: number;
  level: number;
  badges: string[];
}

const UserProfile: React.FC = () => {
  const { user, refreshUserProfile, loading, error } = useUser();
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    username: "",
    email: "",
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
      setUpdatedProfile({ username: user.username, email: user.email });
    }

    const fetchGamification = async () => {
      try {
        const response = await axios.get("/api/user/gamification");
        setGamification(response.data);
      } catch (err) {
        console.error("Failed to fetch gamification data:", err);
      }
    };

    fetchGamification();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedProfile({
      ...updatedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const formData = new FormData();
      formData.append("username", updatedProfile.username);
      formData.append("email", updatedProfile.email);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await axios.post("/api/user/update", formData);
      setSuccessMessage("Profile updated successfully!");
      refreshUserProfile();
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {editing ? (
        <>
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
          <input type="file" onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
          {preview && <img src={preview} alt="Profile Preview" />}
          <button onClick={handleSubmit}>Save Changes</button>
        </>
      ) : (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <img src={user.profilePictureUrl || "/default-avatar.png"} alt="Profile" />
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
      {successMessage && <p>{successMessage}</p>}
      <div className="gamification">
        <h3>Gamification</h3>
        <p>Points: {gamification.points}</p>
        <p>Level: {gamification.level}</p>
        <p>Badges: {gamification.badges.join(", ")}</p>
      </div>
    </div>
  );
};

export default UserProfile;
