import React, { useState } from 'react';
import { trackConversion } from 'src/services/googleAnalytics';
import styles from './Forms.module.css'; // Import CSS module for styling
import { validateEmail } from './FormsUtils'; // Use reusable email validation utility

interface FormData {
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { email, password } = formData;

    // Validate inputs
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Simulate successful sign-up; replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Track successful sign-up conversion
      trackConversion('Signup', 'User signed up successfully');

      setSuccess('Sign-up successful! Welcome aboard.');
      setFormData({ email: '', password: '' }); // Reset form
    } catch (err) {
      setError('Sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['form-container']}>
      <h2 className={styles['form-title']}>Sign Up</h2>
      {error && <p className={styles['error-message']}>{error}</p>}
      {success && <p className={styles['success-message']}>{success}</p>}
      <form onSubmit={handleSignup} className={styles['form']}>
        <label htmlFor="email" className={styles['label']}>
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          className={styles['input']}
          aria-label="Email"
          required
        />
        <label htmlFor="password" className={styles['label']}>
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          className={styles['input']}
          aria-label="Password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={styles['submit-button']}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
