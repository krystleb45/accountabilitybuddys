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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
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
      setMessage("A password reset link has been sent to your email.");
      setEmail(""); // Clear the input field
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} aria-live="assertive">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            aria-label="Email"
            style={error ? { border: "1px solid red" } : {}}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          aria-live="polite"
          style={{
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            padding: "10px",
            border: "none",
            marginTop: "10px",
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Display messages */}
      {message && (
        <p role="alert" style={{ color: "green" }} aria-live="polite">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" style={{ color: "red" }} aria-live="assertive">
          {error}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
