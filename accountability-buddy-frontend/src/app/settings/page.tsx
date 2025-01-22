'use client'; // Mark as Client Component

import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    console.log('Settings Saved:', { username, email, theme, notifications });
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-100">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">Manage your account preferences.</p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Notifications
          </label>
          <div className="flex items-center">
            <button
              className={`p-3 rounded-lg ${
                notifications ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}
              onClick={() => setNotifications(!notifications)}
            >
              {notifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
