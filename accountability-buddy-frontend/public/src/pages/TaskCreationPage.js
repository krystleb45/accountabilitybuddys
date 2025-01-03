import React, { useState } from 'react';
import axios from 'axios';
import './TaskCreationPage.css'; // Import custom styles

const TaskCreationPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Pending',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { title, description, priority, dueDate, status } = formData;

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form
  const validateForm = () => {
    if (!title || !description || !dueDate) {
      setError('All fields are required.');
      return false;
    }
    if (new Date(dueDate) < new Date()) {
      setError('Due date must be in the future.');
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
      const response = await axios.post('/api/tasks', formData);
      if (response.data.success) {
        setSuccessMessage('Task created successfully!');
        setFormData({ title: '', description: '', priority: 'Medium', dueDate: '', status: 'Pending' });
      } else {
        setError('Failed to create task. Please try again.');
      }
    } catch (err) {
      console.error('Task creation error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-creation-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Create a New Task</h1>
      <p>Define your task details clearly to help you stay organized and focused.</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="title">Task Title:</label>
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
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            name="priority"
            value={priority}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={dueDate}
            onChange={handleChange}
            required
            aria-required="true"
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={status}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', margin: '5px 0' }}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
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
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskCreationPage;
