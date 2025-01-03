import React, { useState } from "react";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Function to validate the email address format
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage(""); // Clear previous message
    setError(""); // Clear previous error

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false); // Stop loading since validation failed
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
        { email }
      );
      setMessage(res.data.message || "Password reset instructions have been sent to your email.");
    } catch (err) {
      setError("Failed to send password reset instructions. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="forgot-password-form">
      <h2>Forgot Password</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          aria-label="Email"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Instructions"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
