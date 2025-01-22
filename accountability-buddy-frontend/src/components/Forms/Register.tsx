import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './Forms.module.css'; // Import CSS module for styling
import { validateEmail } from './FormsUtils'; // Reuse email validation utility

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { name, email, password, confirmPassword } = formData;

    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

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

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password });
      router.push('/login'); // Redirect to the login page on successful registration
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message ||
          'Registration failed. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['form-container']}>
      <h2 className={styles['form-title']}>Register</h2>
      {error && <p className={styles['error-message']}>{error}</p>}
      <form onSubmit={handleRegister} className={styles['form']}>
        <label htmlFor="name" className={styles['label']}>
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleInputChange}
          className={styles['input']}
          aria-label="Name"
          required
        />
        <label htmlFor="email" className={styles['label']}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
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
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          className={styles['input']}
          aria-label="Password"
          required
        />
        <label htmlFor="confirmPassword" className={styles['label']}>
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className={styles['input']}
          aria-label="Confirm Password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={styles['submit-button']}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
