import React, { useState } from "react";
import "./ProfileSettings.css"; // Optional CSS for styling

interface User {
  name: string;
  email: string;
}

interface ProfileSettingsProps {
  user: User;
  onUpdate: (data: { name: string; email: string; password?: string }) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Call the update function with new data
    onUpdate({
      name: formData.name,
      email: formData.email,
      ...(formData.password ? { password: formData.password } : {}),
    });
    setSuccess("Profile updated successfully!");
  };

  return (
    <div className="profile-settings" role="region" aria-label="Profile Settings">
      <h2>Profile Settings</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="New Password"
        />
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm New Password"
        />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileSettings;
