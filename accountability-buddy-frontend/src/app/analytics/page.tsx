'use client'; // Ensure it's a Client Component

import React from 'react';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          Analytics Dashboard
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Gain insights into platform performance, user activity, and more.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Traffic Analytics */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Traffic Overview
          </h2>
          <p className="text-gray-600 mb-4">
            Monitor the number of visitors and engagement trends.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View Traffic
          </button>
        </section>

        {/* User Activity */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            User Activity
          </h2>
          <p className="text-gray-600 mb-4">
            Analyze user interactions and popular features.
          </p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            View Activity
          </button>
        </section>

        {/* Revenue Analytics */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Revenue Insights
          </h2>
          <p className="text-gray-600 mb-4">
            Track subscription plans and overall revenue generation.
          </p>
          <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
            View Revenue
          </button>
        </section>
      </main>

      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights
        reserved.
      </footer>
    </div>
  );
};

export default AnalyticsPage;
