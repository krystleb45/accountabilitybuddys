"use client"; // Mark as Client Component

import React, { useState } from "react";
import Link from "next/link";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Placeholder for form submission logic
    console.log("Password reset email sent to:", email);
    setSubmitted(true);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Forgot Password
        </h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Enter your email address:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="example@example.com"
                required
              />
              {error && (
                <p className="text-red-600 mt-2" role="alert">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
                error ? "bg-red-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center text-green-600">
            <h3 className="text-xl font-semibold">Check Your Email</h3>
            <p className="mt-2">
              We have sent a password reset link to{" "}
              <span className="font-bold">{email}</span>. Please check your
              inbox and follow the instructions to reset your password.
            </p>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-6 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
