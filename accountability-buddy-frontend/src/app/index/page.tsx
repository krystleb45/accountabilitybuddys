"use client";

import React from "react";
import Link from "next/link";

const IndexPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Accountability Buddy
        </h1>
        <p className="text-lg text-gray-600">
          Empowering you to achieve your goals with support and accountability.
        </p>
      </header>

      <main className="space-y-4">
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-300 transition"
        >
          Sign Up
        </Link>
      </main>

      <footer className="mt-8 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default IndexPage;
