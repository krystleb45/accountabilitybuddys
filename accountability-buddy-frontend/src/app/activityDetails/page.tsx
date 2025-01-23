'use client'; // Ensure it's a Client Component

import React from 'react';

// Define props for the component
type ActivityDetailsProps = {
  params?: {
    activity?: {
      title?: string;
      description?: string;
      createdAt?: string;
      completed?: boolean;
    };
  };
};

const ActivityDetailsPage: React.FC<ActivityDetailsProps> = ({ params }) => {
  if (!params || !params.activity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">
            Activity details are not available. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const { activity } = params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-4">
            {activity.title || 'Untitled Activity'}
          </h1>
          <p className="text-gray-600 text-center">
            {activity.description || 'No description available.'}
          </p>
        </header>

        {/* Main Content */}
        <main className="text-gray-700">
          <p className="mb-4">
            <strong>Created On:</strong>{' '}
            {activity.createdAt
              ? new Date(activity.createdAt).toLocaleDateString()
              : 'Unknown'}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            {activity.completed ? 'Completed' : 'In Progress'}
          </p>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Accountability Buddy. All rights
          reserved.
        </footer>
      </div>
    </div>
  );
};

export default ActivityDetailsPage;
