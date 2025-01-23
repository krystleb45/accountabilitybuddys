'use client';

import React from 'react';

const NotFoundPage: React.FC = () => {
  const handleRedirect = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'; // Redirect to the homepage
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-8">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">Page Not Found</p>
      <button
        onClick={handleRedirect}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        aria-label="Go to Homepage"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFoundPage;
