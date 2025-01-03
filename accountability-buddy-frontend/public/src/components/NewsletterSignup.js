import React, { useState } from 'react';
import axios from 'axios'; // To handle the newsletter sign-up request

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Email validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://accountabilitybuddys.com/api/newsletter/subscribe',
        { email }
      );
      setSuccessMessage('Thank you for subscribing to our newsletter!');
      setEmail(''); // Clear the email input after success
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to subscribe. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-signup" aria-live="polite">
      <h2>Subscribe to our Newsletter</h2>
      <form onSubmit={handleSubmit} aria-live="assertive">
        <label htmlFor="email" className="sr-only">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={loading}
          aria-label="Enter your email"
        />
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            padding: '10px',
            border: 'none',
            marginTop: '10px',
          }}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {successMessage && (
        <p role="alert" style={{ color: 'green' }} aria-live="polite">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p role="alert" style={{ color: 'red' }} aria-live="assertive">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;
