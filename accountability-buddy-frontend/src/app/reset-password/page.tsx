'use client'; // Mark as Client Component

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js

const ResetPasswordPage: React.FC = () => {
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.password || !form.confirmPassword) {
      setError('Both fields are required.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // Placeholder for password reset logic
    console.log('Password reset submitted:', form);
    setSubmitted(true);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Reset Your Password
        </h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600 focus:ring focus:ring-blue-200"
                placeholder="Enter a new password"
                required
                aria-label="Enter a new password"
                minLength={8}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm New Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600 focus:ring focus:ring-blue-200"
                placeholder="Confirm your new password"
                required
                aria-label="Confirm your new password"
              />
            </div>

            {error && (
              <p className="text-red-600" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Reset Password"
            >
              Reset Password
            </button>
          </form>
        ) : (
          <div className="text-center text-green-600">
            <h3 className="text-xl font-semibold">
              Password Reset Successful!
            </h3>
            <p>You can now log in with your new password.</p>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link href="/login">
            <a
              className="text-blue-600 hover:underline"
              aria-label="Back to Login"
            >
              Back to Login
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
