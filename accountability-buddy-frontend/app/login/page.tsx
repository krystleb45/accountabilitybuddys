"use client"; // Mark as Client Component

import React, { useState, lazy, Suspense } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link"; // Import Link from Next.js

// Define the base URL for the API
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

// Lazy-loaded component for loading spinner
const LoadingSpinner = lazy(() => import("../../src/components/LoadingSpinner"));

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate input fields
    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("authToken", response.data.token);
        router.push("/dashboard");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err); // Log the actual error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {loading ? (
            <Suspense fallback={<div>Loading...</div>}>
              <LoadingSpinner />
            </Suspense>
          ) : (
            "Login"
          )}
        </button>
        {error && (
          <p className="text-red-600 text-center mt-2" role="alert">
            {error}
          </p>
        )}
      </form>
      {/* Forgot Password Link */}
      <div className="mt-6 text-center">
        <Link href="/forgot-password">
          <span className="text-blue-600 hover:underline" role="button">
            Forgot Password?
          </span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
