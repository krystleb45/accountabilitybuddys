"use client"; // Ensure it's a Client Component

import React from "react";
import Link from 'next/link'; // Import Link from Next.js

// Admin Dashboard Page
const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Admin Dashboard
        </h1>
        <nav className="flex gap-4">
          <Link href="/dashboard">
            <span className="text-blue-600 font-semibold hover:underline">
              Dashboard
            </span>
          </Link>
          <Link href="/settings">
            <span className="text-blue-600 font-semibold hover:underline">
              Settings
            </span>
          </Link>
          <Link href="/logout">
            <span className="text-red-600 font-semibold hover:underline">
              Logout
            </span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            User Management
          </h2>
          <p className="text-gray-600 mb-4">
            Manage users, view profiles, and adjust roles.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View Users
          </button>
        </section>

        {/* Site Settings Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Site Settings
          </h2>
          <p className="text-gray-600 mb-4">
            Adjust global settings, themes, and preferences.
          </p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Edit Settings
          </button>
        </section>

        {/* Analytics Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Analytics Overview
          </h2>
          <p className="text-gray-600 mb-4">
            View site traffic, user activity, and analytics data.
          </p>
          <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
            View Analytics
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights
        reserved.
      </footer>
    </div>
  );
};

export default AdminDashboardPage;
