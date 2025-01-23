import React, { useState } from 'react';
import './ProfileSettings.module.css'; // Adjusted to use CSS Modules

interface User {
  name: string;
  email: string;
}

interface ProfileSettingsProps {
  user: User;
  onUpdate: (updatedData: User & { password?: string }) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate password strength (basic)
  const isPasswordStrong = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password && !isPasswordStrong(formData.password)) {
      setError(
        'Password must be at least 8 characters long, include at least one letter, one number, and one special character.'
      );
      return;
    }

    // Call the update function with new data
    onUpdate({
      name: formData.name,
      email: formData.email,
      ...(formData.password ? { password: formData.password } : {}),
    });

    setSuccess('Profile updated successfully!');
    setTimeout(() => setSuccess(null), 5000); // Clear success message after 5 seconds
  };

  return (
    <div
      className="profile-settings"
      role="region"
      aria-labelledby="profile-settings-header"
    >
      <h2 id="profile-settings-header">Profile Settings</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            aria-required="true"
            aria-label="Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-label="Email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            aria-describedby="passwordHelp"
            aria-label="Password"
          />
          <small id="passwordHelp">
            Leave blank to keep your current password
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            aria-label="Confirm Password"
          />
        </div>
        {error && (
          <p className="error-message" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
        {success && (
          <p className="success-message" role="alert" aria-live="polite">
            {success}
          </p>
        )}
        <button type="submit" aria-busy={Boolean(success)}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
