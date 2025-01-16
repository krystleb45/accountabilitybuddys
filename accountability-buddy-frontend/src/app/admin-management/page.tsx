"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define User type for better typing
type User = {
  id: string;
  name: string;
  role: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

const AdminManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${API_URL}/admin/users`);
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Management</h1>
      
      {loading ? (
        <p className="text-lg text-center text-blue-500">Loading...</p>
      ) : error ? (
        <p className="text-lg text-center text-red-500">{error}</p>
      ) : (
        users.length > 0 ? (
          <ul className="list-none p-0">
            {users.map((user) => (
              <li 
                key={user.id} 
                className="mb-4 p-4 bg-white rounded-lg shadow-md flex justify-between items-center"
              >
                <span className="text-lg font-medium">{user.name} - {user.role}</span>
                <button 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                >
                  Edit Role
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-center text-gray-600">No users found.</p>
        )
      )}
    </div>
  );
};

export default AdminManagementPage;
