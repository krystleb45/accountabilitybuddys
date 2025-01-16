"use client"; // Mark as Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link'; // Import Link from Next.js

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear the error when the component unmounts
  useEffect(() => {
    return () => setError('');
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate inputs
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        router.push('/login');
      } else {
        setError('Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
            aria-label="Enter your name"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
            aria-label="Enter your email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
            aria-label="Enter your password"
            autoComplete="new-password"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            required
            aria-label="Confirm your password"
            autoComplete="new-password"
          />
          
          {error && (
            <div className="text-red-600 text-center mt-2" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Link to Login Page */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login">
              <a className="text-blue-600 hover:underline" aria-label="Login here">Login here</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
