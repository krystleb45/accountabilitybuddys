import React, { useState } from 'react';
import axios from 'axios';

const ContactSupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { name, email, message } = formData;

  // Handle form input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(''); // Clear error message on input change
  };

  // Validate email format
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validate the entire form
  const validateForm = () => {
    if (!name) {
      setErrorMessage('Name is required.');
      return false;
    }
    if (!email || !validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!message) {
      setErrorMessage('Message cannot be empty.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // Validate form before submission
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Send support request
      const response = await axios.post('/api/support/contact', formData);

      if (response.data.success) {
        setSuccessMessage('Your message has been sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setErrorMessage('Failed to send your message. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-support-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Contact Support</h1>
      <p>If you have any questions or issues, please fill out the form below to contact our support team.</p>

      <form onSubmit={handleSubmit} aria-label="Contact Support Form">
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            aria-required="true"
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={onChange}
            rows="5"
            required
            aria-required="true"
          ></textarea>
        </div>

        {errorMessage && (
          <div className="error-message" role="alert" style={{ color: 'red', marginBottom: '20px' }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="success-message" role="alert" style={{ color: 'green', marginBottom: '20px' }}>
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#28a745',
            color: '#fff',
            borderRadius: '5px',
          }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactSupportPage;
