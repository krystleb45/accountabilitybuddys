'use client'; // Mark as Client Component

import React, { useState } from 'react';
import axios from 'axios';

const TaskCreationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Pending',
  });
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form data
  const validateForm = (): boolean => {
    if (!formData.title || !formData.description || !formData.dueDate) {
      setError('All fields are required.');
      return false;
    }
    if (new Date(formData.dueDate) < new Date()) {
      setError('Due date must be in the future.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/tasks', formData);
      if (response.data.success) {
        setSuccessMessage('Task created successfully!');
        setFormData({
          title: '',
          description: '',
          priority: 'Medium',
          dueDate: '',
          status: 'Pending',
        });
      } else {
        setError('Failed to create task. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Create a New Task
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <label htmlFor="title" className="block text-gray-700 font-medium">
            Task Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="w-full p-3 border rounded-lg"
            required
            aria-label="Task Title"
          />

          {/* Description Input */}
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium"
          >
            Task Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows={4}
            className="w-full p-3 border rounded-lg"
            required
            aria-label="Task Description"
          />

          {/* Priority Dropdown */}
          <label htmlFor="priority" className="block text-gray-700 font-medium">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            aria-label="Task Priority"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {/* Due Date Input */}
          <label htmlFor="dueDate" className="block text-gray-700 font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
            aria-label="Due Date"
          />

          {/* Status Dropdown */}
          <label htmlFor="status" className="block text-gray-700 font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            aria-label="Task Status"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Error and Success Messages */}
          {error && (
            <p className="text-red-600" role="alert">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="text-green-600" role="status">
              {successMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
            aria-label="Create Task"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationPage;
