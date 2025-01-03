"use client"; // Mark as Client Component

import React, { useState } from "react";
import axios from "axios";

// TaskCreationPage Component
const TaskCreationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    status: "Pending",
  });
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { title, description, priority, dueDate, status } = formData;

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate the form
  const validateForm = (): boolean => {
    if (!title || !description || !dueDate) {
      setError("All fields are required.");
      return false;
    }
    if (new Date(dueDate) < new Date()) {
      setError("Due date must be in the future.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate form before submission
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/tasks", formData);
      if (response.data.success) {
        setSuccessMessage("Task created successfully!");
        setFormData({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: "",
          status: "Pending",
        });
      } else {
        setError("Failed to create task. Please try again.");
      }
    } catch (err) {
      console.error("Task creation error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create a New Task</h1>
        <p className="text-gray-600 mb-6">
          Define your task details clearly to help you stay organized and focused.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Task Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600"
              placeholder="Enter task title"
            />
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description:</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600"
              placeholder="Describe the task in detail"
            ></textarea>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label htmlFor="priority" className="block text-gray-700 font-medium mb-1">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={priority}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Due Date Field */}
          <div>
            <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-1">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label htmlFor="status" className="block text-gray-700 font-medium mb-1">Status:</label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-600"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Error and Success Messages */}
          {error && <p className="text-red-600">{error}</p>}
          {successMessage && <p className="text-green-600">{successMessage}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationPage;
