'use client';

import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1>
      </header>
      <main className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700">Welcome to Accountability Buddy...</p>
        </section>
        {/* Add other sections as necessary */}
      </main>
      <footer className="text-center mt-8 text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights
        reserved.
      </footer>
    </div>
  );
};

export default TermsOfServicePage;
