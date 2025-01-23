'use client'; // Mark as Client Component

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js

// Activity Item Component
const ActivityItem: React.FC<{
  activity: { description: string; date: string; type: string };
}> = ({ activity }) => (
  <div className="p-4 bg-white rounded-lg shadow-md mb-2">
    <div className="flex justify-between items-center">
      <p className="text-gray-800">{activity.description}</p>
      <span className="text-sm text-gray-500">{activity.date}</span>
    </div>
    <span
      className={`text-sm ${
        activity.type === 'completed' ? 'text-green-600' : 'text-blue-600'
      }`}
    >
      {activity.type === 'completed' ? 'Completed' : 'Created'}
    </span>
  </div>
);

const RecentActivitiesPage: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  // Mocked recent activities data
  const activities = [
    {
      description: "Completed goal 'Finish project proposal'",
      date: 'Today',
      type: 'completed',
    },
    {
      description: "Created task 'Review team feedback'",
      date: 'Yesterday',
      type: 'created',
    },
    {
      description: "Completed task 'Update website content'",
      date: '2 days ago',
      type: 'completed',
    },
    {
      description: "Created goal 'Launch marketing campaign'",
      date: 'Last week',
      type: 'created',
    },
  ];

  // Filter activities based on the selected filter
  const filteredActivities = activities.filter((activity) => {
    if (filter === 'completed') return activity.type === 'completed';
    if (filter === 'created') return activity.type === 'created';
    return true; // 'all'
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-50 to-blue-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Recent Activities</h1>
        <nav className="flex gap-4">
          <Link href="/dashboard">
            <a className="text-blue-600 font-semibold hover:underline">
              Dashboard
            </a>
          </Link>
          <Link href="/profile">
            <a className="text-blue-600 font-semibold hover:underline">
              Profile
            </a>
          </Link>
        </nav>
      </header>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          Filter Activities
        </h2>
        <div className="flex gap-4">
          {['all', 'completed', 'created'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`py-2 px-4 rounded-lg ${
                filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              aria-pressed={filter === type}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <main className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Your Recent Activities
        </h2>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))
        ) : (
          <p className="text-gray-500">No recent activities to show.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights
        reserved.
      </footer>
    </div>
  );
};

export default RecentActivitiesPage;
