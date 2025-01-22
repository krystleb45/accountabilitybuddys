'use client'; // Ensure it's a Client Component

import React from 'react';

type ActivityDetailsProps = {
  activity: {
    title: string;
    description: string;
    createdAt: string;
    completed?: boolean;
  };
};

const ActivityDetailsPage: React.FC<ActivityDetailsProps> = ({ activity }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-4">
            {activity.title}
          </h1>
          <p className="text-gray-600 text-center">{activity.description}</p>
        </header>

        {/* Main Content */}
        <main className="text-gray-700">
          <p className="mb-4">
            <strong>Created On:</strong>{' '}
            {new Date(activity.createdAt).toLocaleDateString()}
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
