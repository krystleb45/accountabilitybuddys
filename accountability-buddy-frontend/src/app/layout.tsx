'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

// Define props for the Layout component
interface LayoutProps {
  children: React.ReactNode | React.ReactNode[]; // Accept array or single ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md py-4">
        <nav className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Accountability Buddy
            </Link>
          </h1>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-6 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-4 mt-8">
        <div className="container mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Accountability Buddy. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
