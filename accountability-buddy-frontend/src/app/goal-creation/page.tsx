"use client"; // Mark as Client Component

import React, { useState } from "react";
import Link from "next/link"; // Import Link from Next.js

interface GoalForm {
  title: string;
  description: string;
  deadline: string;
  category: string;
}

const GoalCreationPage: React.FC = () => {
  const [form, setForm] = useState<GoalForm>({
    title: "",
    description: "",
    deadline: "",
    category: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.title || !form.deadline || !form.category) {
      setError("Title, Deadline, and Category are required.");
      return;
    }

    // Placeholder for goal creation logic
    console.log("Goal Created:", form);
    setSubmitted(true);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create a New Goal
        </h1>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
                Goal Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="e.g., Learn React.js"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                Description (Optional):
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                rows={4}
                placeholder="Add a brief description of your goal..."
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-gray-700 font-medium mb-1">
                Deadline:
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-gray-700 font-medium mb-1">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                required
              >
                <option value="">Select a category</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="Learning">Learning</option>
              </select>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Goal
            </button>
          </form>
        ) : (
          <div className="text-center text-green-600">
            <h3 className="text-xl font-semibold">Goal Created Successfully!</h3>
            <p>
              Your new goal "<span className="font-bold">{form.title}</span>" has been created.
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/dashboard">
            <span className="text-blue-600 hover:underline">
              Back to Dashboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GoalCreationPage;
