import React, { useState } from "react";
import axios from "axios";
import "./NewsletterSignup.css"; // Optional: Import CSS for styling

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Email validation
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://accountabilitybuddys.com/api/newsletter/subscribe",
        { email }
      );
      if (response.status === 200) {
        setSuccessMessage("Thank you for subscribing to our newsletter!");
        setEmail("");
      } else {
        throw new Error("Subscription failed.");
      }
    } catch (err) {
      console.error("Failed to subscribe:", err);
      setErrorMessage("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-signup" role="form" aria-labelledby="newsletter-header">
      <h3 id="newsletter-header">Subscribe to our Newsletter</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email" className="sr-only">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email address"
            aria-required="true"
            className="email-input"
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading} className="subscribe-button">
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      </form>
      {successMessage && (
        <p className="success-message" role="status">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="error-message" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;
