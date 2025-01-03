import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Updated to use React Router v6
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext); // Get the login function from AuthContext
  const navigate = useNavigate(); // React Router v6 navigation

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
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
        `${process.env.REACT_APP_API_URL}/auth/login`, // Use environment variable for API URL
        { email, password }
      );

      const { token } = response.data;

      // Call login function from AuthContext to set the token and authenticate the user
      login(token);

      // Redirect to the homepage or dashboard after successful login
      navigate("/home");
    } catch (err) {
      // Enhanced error handling for specific HTTP codes
      if (err.response) {
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
      <form onSubmit={handleLogin} aria-live="polite"> {/* Announce form updates to screen readers */}
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
          <p role="alert" style={{ color: "red" }} aria-live="assertive"> {/* Announce errors to screen readers */}
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        <a href="/forget-password" aria-label="Forgot your password? Navigate to the reset page."> {/* Accessible link */}
          Forgot your password?
        </a>
      </p>
    </div>
  );
};

export default Login;
