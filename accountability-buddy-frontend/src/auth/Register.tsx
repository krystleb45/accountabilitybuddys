"use client"; // Mark as Client Component

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // Use Next.js router
import Link from "next/link"; // Import Link from Next.js

// Define the types for form data
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const router = useRouter(); // Next.js router for navigation
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>(""); // Specify the type for error state
  const [loading, setLoading] = useState<boolean>(false); // Loading state for form submission

  const { username, email, password, confirmPassword } = formData;

  // Handle input changes
  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate the form data
  const validateForm = (): boolean => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    // Client-side validation
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, // Use environment variable for API URL
        { username, email, password } // Only send necessary data
      );
      if (res.data.token) {
        // Assume setToken is a valid function
        // setToken(res.data.token);
        router.push("/dashboard"); // Use Next.js router for navigation
      } else {
        setError("Registration successful, but no token received.");
      }
    } catch (err: any) { // Adding type 'any' for the error object
      setError(
        err.response
          ? err.response.data.msg
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit} aria-live="assertive">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            placeholder="Username"
            required
            aria-label="Username"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            required
            aria-label="Email"
          />
          {error.includes("email") && (
            <p style={{ color: "red" }}>{error}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            required
            aria-label="Password"
          />
          {error.includes("Password") && (
            <p style={{ color: "red" }}>{error}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            placeholder="Confirm Password"
            required
            aria-label="Confirm Password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red" }} role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      <p>
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
