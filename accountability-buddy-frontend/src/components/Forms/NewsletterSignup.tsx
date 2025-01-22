import React, { useState } from 'react';
import axios from 'axios';
import styles from './Forms.module.css'; // Import CSS module for styling
import { validateEmail } from './FormsUtils'; // Use the reusable email validation utility

interface NewsletterSignupProps {
  onSubmit?: (data: { email: string; consent: boolean }) => void; // Optional callback for testing
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>('');
  const [consent, setConsent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

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

    // Mock onSubmit callback for testing
    if (onSubmit) {
      onSubmit({ email, consent });
      setEmail('');
      setConsent(false);
      setLoading(false);
      return;
    }

    // Perform API request
    try {
      const response = await axios.post(
        'https://accountabilitybuddys.com/api/newsletter/subscribe',
        { email }
      );
      if (response.status === 200) {
        setSuccessMessage('Thank you for subscribing to our newsletter!');
        setEmail('');
        setConsent(false);
      } else {
        throw new Error('Subscription failed.');
      }
    } catch (err: any) {
      console.error('Failed to subscribe:', err);
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to subscribe. Please try again later.'
      );
    } finally {
      setLoading(false);
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
