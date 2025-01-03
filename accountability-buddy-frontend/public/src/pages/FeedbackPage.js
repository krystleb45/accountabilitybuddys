import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackPage.css'; // Import custom styles

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    category: 'General',
    message: '',
    contactInfo: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { category, message, contactInfo } = formData;

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form
  const validateForm = () => {
    if (!message) {
      setError('Feedback message is required.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate form before submission
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/feedback', formData);
      if (response.data.success) {
        setSuccessMessage('Thank you for your feedback!');
        setFormData({ category: 'General', message: '', contactInfo: '' });
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Feedback</h1>
      <p>We value your feedback. Please let us know how we can improve our services.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          >
            <option value="General">General</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Bug Report">Bug Report</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={handleChange}
            required
            aria-required="true"
            rows="5"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          ></textarea>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="contactInfo">Contact Info (Optional):</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={contactInfo}
            onChange={handleChange}
            placeholder="Email or phone number"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />
        </div>

        {error && (
          <div className="error-message" role="alert" style={{ color: 'red', marginBottom: '20px' }}>
            {error}
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
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '5px',
          }}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
