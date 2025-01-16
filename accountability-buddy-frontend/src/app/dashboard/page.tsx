"use client";

// app/DashboardPage.tsx

import React, { ReactNode, useEffect, useState } from 'react';
import { fetchDashboardData } from '../../services/apiService'; // Ensure the path is correct
import Link from 'next/link'; // Import Link from Next.js

// Define Section component with children prop correctly typed
const Section: React.FC<{ title: string; children?: ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {children ? (
      children
    ) : (
      <div className="h-32 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Content will be displayed here</p>
      </div>
    )}
  </div>
);

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null); // Adjust type based on your expected data structure
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDashboardData();
        setData(result); // Set the fetched data
      } catch (err) {
        setError('Failed to load dashboard data'); // Set an error message
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">Dashboard</h1>
        <nav className="flex gap-4">
          <Link href="/analytics">
            <span className="text-blue-600 font-medium hover:underline">Analytics</span>
          </Link>
          <Link href="/settings">
            <span className="text-blue-600 font-medium hover:underline">Settings</span>
          </Link>
          <Link href="/logout">
            <span className="text-red-600 font-medium hover:underline">Logout</span>
          </Link>
        </nav>
      </header>

      {/* Main Dashboard Content */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Display error message if there is an error */}
        {error && (
          <Section title="Error">
            <p className="text-red-500">{error}</p>
          </Section>
        )}

        {/* Recent Activity Section */}
        <Section title="Recent Activity">
          {/* Populate with data if available */}
          <ul className="list-none p-0">
            {data?.recentActivities?.map((activity: string, index: number) => (
              <li key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                {activity}
              </li>
            ))}
          </ul>
        </Section>

        {/* Tasks Section */}
        <Section title="My Tasks">
          <ul className="list-none p-0">
            {data?.tasks?.map((task: { id: string; name: string }) => (
              <li key={task.id} className="mb-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <span>{task.name}</span>
                <button className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-all" aria-label="Complete Task">
                  Complete
                </button>
              </li>
            ))}
          </ul>
        </Section>

        {/* Notifications Section */}
        <Section title="Notifications">
          <ul className="list-none p-0">
            {data?.notifications?.map((notification: string, index: number) => (
              <li key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                {notification}
              </li>
            ))}
          </ul>
        </Section>

        {/* Additional Sections */}
        <Section title="Group Recommendations" />
        <Section title="Goal Progress" />
        <Section title="Accountability Buddies" />
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardPage;
