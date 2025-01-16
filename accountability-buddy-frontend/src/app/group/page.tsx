"use client"; // Mark as Client Component

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link"; // Import Link from Next.js

// Define types for group data
interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
}

// Placeholder API URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

const GroupPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`${API_URL}/groups`);
        setGroups(response.data);
      } catch (err) {
        setError('Failed to load groups.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter groups based on search term
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Groups</h1>
        <nav className="flex gap-4">
          <Link href="/dashboard">
            <span className="text-blue-600 hover:underline">Dashboard</span>
          </Link>
          <Link href="/settings">
            <span className="text-blue-600 hover:underline">Settings</span>
          </Link>
        </nav>
      </header>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          placeholder="Search for groups..."
        />
      </div>

      {/* Main Content */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : filteredGroups.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <li
              key={group.id}
              className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {group.name}
              </h2>
              <p className="text-gray-600 mb-4">{group.description}</p>
              <p className="text-gray-500 mb-2">
                Members: {group.members}
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Join Group
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No groups found.</p>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default GroupPage;
