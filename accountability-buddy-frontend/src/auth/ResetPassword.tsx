import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`,
        { password }
      );
      setMessage("Password reset successful! Redirecting to login...");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login"); // Use navigate instead of history.push
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} aria-live="assertive">
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            aria-label="New password"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            aria-label="Confirm password"
          />
        </div>
        <button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

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

export default ResetPassword;
