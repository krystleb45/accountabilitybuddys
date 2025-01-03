"use client"; // Mark as Client Component

import React, { useState, useContext } from "react";
import { useRouter } from "next/router"; // Use Next.js router
import { useAuth } from "../../src/context/AuthContext"; // Assuming useAuth is being used
import axios from "axios";
import Link from "next/link"; // Import Link from Next.js

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>(""); // Specify type for state
  const [password, setPassword] = useState<string>(""); // Specify type for state
  const [error, setError] = useState<string>(""); // Specify type for state
  const [loading, setLoading] = useState<boolean>(false); // Specify type for state
  const { login } = useAuth(); // Get the login function from useAuth
  const router = useRouter(); // Next.js router for navigation

  const validateEmail = (email: string): boolean => { // Specify return type
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => { // Specify type for event
    e.preventDefault();
    setError(""); // Clear any previous errors
    setLoading(true); // Start loading

    // Client-side email validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, // Use environment variable for API URL
        { email, password }
      );

      const { token } = response.data;

      // Call login function from AuthContext to set the token and authenticate the user
      login(token);

      // Redirect to the homepage or dashboard after successful login
      router.push("/home"); // Use Next.js router for navigation
    } catch (err) {
      // Enhanced error handling for specific HTTP codes
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password.");
        } else if (err.response.status === 400) {
          setError("Bad request. Please check your input.");
        } else if (err.response.status === 500) {
          setError("Internal server error. Please try again later.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false); // Ensure loading is stopped
      setPassword(""); // Clear password field after submission for security
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} aria-live="polite">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            aria-label="Email"
            disabled={loading} // Disable input while loading
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            aria-label="Password"
            disabled={loading} // Disable input while loading
          />
        </div>
        {error && (
          <p role="alert" style={{ color: "red" }} aria-live="assertive">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        <Link href="/forgot-password" aria-label="Forgot your password? Navigate to the reset page.">
          Forgot your password?
        </Link>
      </p>
    </div>
  );
};

export default Login;
