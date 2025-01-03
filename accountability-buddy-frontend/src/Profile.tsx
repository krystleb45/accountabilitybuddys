import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useAuth } from "../src/context/AuthContext";

const Profile: React.FC = () => {
  const { authToken, logout } = useAuth(); // Safely uses context
  const [profile, setProfile] = useState({ username: "", email: "", subscriptionStatus: "" });
  const [updatedProfile, setUpdatedProfile] = useState({ username: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setUpdatedProfile({ username: response.data.username, email: response.data.email });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authToken]);

  // ... rest of the Profile component logic as provided earlier ...

  return (
    <div className="profile-page">
      {/* Profile UI */}
    </div>
  );
};

export default Profile;
