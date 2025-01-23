'use client'; // Ensure it's a Client Component

import React, { useState } from 'react';

const FeedbackPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Explicitly define the return type for the function
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Simulate API submission (replace with actual API logic)
    setSubmitted(true);
    setName('');
    setFeedback('');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Feedback</h1>
      <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
        We value your feedback! Let us know how we can improve your experience.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        {submitted && (
          <div className="mb-4 text-green-600 text-center">
            Thank you for your feedback!
          </div>
        )}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setName(e.target.value)
            }
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="feedback"
            className="block text-gray-700 font-medium mb-2"
          >
            Feedback
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
              setFeedback(e.target.value)
            }
            rows={5}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackPage;
