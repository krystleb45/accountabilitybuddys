'use client'; // Ensure it's a Client Component

import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Stay on track and monitor your progress here.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Goals Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Your Goals
          </h2>
          <p className="text-gray-600 mb-4">
            Keep track of your goals and milestones.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            View Goals
          </button>
        </section>

        {/* Recent Activities Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Recent Activities
          </h2>
          <p className="text-gray-600 mb-4">
            See what you've accomplished recently.
          </p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            View Activities
          </button>
        </section>

        {/* Leaderboard Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Leaderboard
          </h2>
          <p className="text-gray-600 mb-4">
            See how you rank among your peers.
          </p>
          <button className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700">
            View Leaderboard
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

export default DashboardPage;
