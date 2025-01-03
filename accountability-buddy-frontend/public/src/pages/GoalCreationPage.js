import React, { useState } from 'react';
import axios from 'axios';
import './GoalCreationPage.css'; // Import custom styles

const GoalCreationPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { title, description, category, deadline } = formData;

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form
  const validateForm = () => {
    if (!title || !description || !deadline) {
      setError('All fields are required.');
      return false;
    }
    if (new Date(deadline) < new Date()) {
      setError('Deadline must be in the future.');
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
      const response = await axios.post('/api/goals', formData);
      if (response.data.success) {
        setSuccessMessage('Goal created successfully!');
        setFormData({ title: '', description: '', category: 'Personal', deadline: '' });
      } else {
        setError('Failed to create goal. Please try again.');
      }
    } catch (err) {
      console.error('Goal creation error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="goal-creation-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Create a New Goal</h1>
      <p>Define your goal clearly to help you stay focused and motivated.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="title">Goal Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            required
            aria-required="true"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            required
            aria-required="true"
            rows="4"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          ></textarea>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          >
            <option value="Personal">Personal</option>
            <option value="Professional">Professional</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={deadline}
            onChange={handleChange}
            required
            aria-required="true"
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
          {loading ? 'Creating...' : 'Create Goal'}
        </button>
      </form>
    </div>
  );
};

export default GoalCreationPage;
