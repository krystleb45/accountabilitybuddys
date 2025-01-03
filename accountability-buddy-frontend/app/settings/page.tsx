"use client"; // Mark as Client Component

import React, { useState } from "react";

// Settings Item component
const SettingsItem = ({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-1">{label}:</label>
    {type === "select" ? (
      <select
        className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600"
        value={value}
        onChange={onChange}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600"
      />
    )}
  </div>
);

const SettingsPage: React.FC = () => {
  // State variables for different settings
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [theme, setTheme] = useState("light");
  const [notification, setNotification] = useState("enabled");
  const [submitted, setSubmitted] = useState(false);

  // Handle form submission
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder logic for saving settings
    console.log("Settings saved:", { username, email, theme, notification });
    setSubmitted(true);

    // Clear the confirmation message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Adjust your preferences and account settings here.</p>
      </header>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        {/* Username Setting */}
        <SettingsItem
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Email Setting */}
        <SettingsItem
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Theme Setting */}
        <SettingsItem
          label="Theme"
          type="select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />

        {/* Notifications Setting */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Notifications:</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={`py-2 px-4 rounded-lg ${
                notification === "enabled"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setNotification("enabled")}
            >
              Enable
            </button>
            <button
              type="button"
              className={`py-2 px-4 rounded-lg ${
                notification === "disabled"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setNotification("disabled")}
            >
              Disable
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>

        {/* Confirmation Message */}
        {submitted && (
          <div className="text-center text-green-600 mt-4">
            <p>Settings saved successfully!</p>
          </div>
        )}
      </form>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default SettingsPage;
