import React, { useState } from 'react';
import axios from 'axios';
import styles from './Forms.module.css'; // Import CSS module for styling
import { validateEmail } from './FormsUtils'; // Use the reusable email validation utility

interface NewsletterSignupProps {
  onSubmit?: (data: { email: string; consent: boolean }) => void; // Optional callback for testing or external handling
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>(''); // State for email input
  const [consent, setConsent] = useState<boolean>(false); // State for consent checkbox
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [successMessage, setSuccessMessage] = useState<string>(''); // Success message
  const [errorMessage, setErrorMessage] = useState<string>(''); // Error message

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true); // Start loading
    setSuccessMessage(''); // Clear previous success message
    setErrorMessage(''); // Clear previous error message

    // Validate email
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    // Validate consent
    if (!consent) {
      setErrorMessage('You must agree to receive newsletters.');
      setLoading(false);
      return;
    }

    // If a custom onSubmit callback is provided, use it (e.g., for testing)
    if (onSubmit) {
      onSubmit({ email, consent });
      setEmail('');
      setConsent(false);
      setLoading(false);
      return;
    }

    // Perform API request to subscribe to the newsletter
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://accountabilitybuddys.com/api'}/newsletter/subscribe`,
        { email }
      );

      if (response.status === 200) {
        setSuccessMessage('Thank you for subscribing to our newsletter!');
        setEmail(''); // Reset email input
        setConsent(false); // Reset consent checkbox
      } else {
        throw new Error('Subscription failed.');
      }
    } catch (err: unknown) {
      // Handle errors gracefully
      if (axios.isAxiosError(err)) {
        setErrorMessage(
          err.response?.data?.message ||
            'Failed to subscribe. Please try again later.'
        );
      } else {
        setErrorMessage(
          'An unexpected error occurred. Please try again later.'
        );
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-testid="newsletter-signup-form"
      className={styles['form-container']}
    >
      <h3 id="newsletter-header" className={styles['form-title']}>
        Subscribe to our Newsletter
      </h3>
      <div>
        <label htmlFor="email" className={styles['label']}>
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
          className={styles['input']}
          required
        />
      </div>
      <div>
        <label htmlFor="consent" className={styles['label']}>
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={() => setConsent((prev) => !prev)}
            aria-label="I agree to receive newsletters"
          />
          I agree to receive newsletters
        </label>
      </div>
      <div>
        <button
          type="submit"
          disabled={loading || !email || !consent}
          className={styles['submit-button']}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {successMessage && (
        <p
          className={styles['success-message']}
          role="status"
          data-testid="success-message"
        >
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p
          className={styles['error-message']}
          role="alert"
          data-testid="error-message"
        >
          {errorMessage}
        </p>
      )}
    </form>
  );
};

export default NewsletterSignup;
