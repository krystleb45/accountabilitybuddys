"use client"; // Mark as Client Component

import React from 'react';
import Link from 'next/link'; // Import Link from Next.js

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 p-8">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-lg w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome!</h1>
        <p className="text-lg text-gray-600 mb-8">
          We're excited to have you on board. Accountability Buddy is here to help you achieve your personal and professional goals while connecting you with a supportive community.
        </p>

        <div className="flex flex-col gap-4">
          <Link href="/register">
            <a className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started
            </a>
          </Link>
          <Link href="/login">
            <a className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Already Have an Account? Log In
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
