"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const FeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState({
    category: 'General',
    message: '',
    contactInfo: '',
  });
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { category, message, contactInfo } = formData;

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form
  const validateForm = (): boolean => {
    if (!message) {
      setError('Feedback message is required.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Feedback</h1>
        <p className="text-gray-600 mb-6">We value your feedback. Let us know how we can improve.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Category:
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="General">General</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Message:
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-2 border rounded"
              placeholder="Enter your feedback here"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo" className="block text-gray-700 font-medium mb-2">
              Contact Info (Optional):
            </label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={contactInfo}
              onChange={handleChange}
              placeholder="Email or phone number"
              className="w-full p-2 border rounded"
            />
          </div>

          {error && (
            <div className="text-red-600" role="alert">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-green-600" role="alert">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white font-bold transition-colors ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
