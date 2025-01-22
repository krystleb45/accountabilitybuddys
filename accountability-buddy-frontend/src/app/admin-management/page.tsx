'use client'; // Ensure it's a Client Component

import React from 'react';

const AdminManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center">
          Admin Management
        </h1>
        <p className="text-lg text-gray-600 text-center">
          Manage roles, permissions, and administrative settings with ease.
        </p>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* User Roles Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            User Roles
          </h2>
          <p className="text-gray-600 mb-4">
            Assign roles and manage user permissions across the platform.
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Manage Roles
          </button>
        </section>

        {/* Permissions Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Permissions
          </h2>
          <p className="text-gray-600 mb-4">
            Define what users can access and modify on the platform.
          </p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Manage Permissions
          </button>
        </section>

        {/* System Settings Section */}
        <section className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            System Settings
          </h2>
          <p className="text-gray-600 mb-4">
            Adjust global configurations for the platform.
          </p>
          <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
            Edit Settings
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

export default AdminManagementPage;
