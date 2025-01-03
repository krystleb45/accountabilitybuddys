import React, { useState, ChangeEvent, FormEvent } from "react";
import { trackConversion } from "../src/analytics/googleAnalytics";
import "./Signup.css";

interface SignupFormData {
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for sign-up
  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Simulate successful sign-up; replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Track successful sign-up conversion
      trackConversion("Signup", "User signed up successfully");

      alert("Sign-up successful! Welcome to Accountability Buddy.");
    } catch (err) {
      console.error("Sign-up error:", err);
      setError("Sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup" role="region" aria-label="Sign Up Form">
      <h3>Create an Account</h3>
      <form onSubmit={handleSignup} noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby="email-error"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            aria-required="true"
            aria-invalid={!!error}
          />
        </div>

        {error && (
          <div
            id="email-error"
            role="alert"
            aria-live="assertive"
            className="error-message"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          aria-label="Sign Up"
          className="signup-button"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
