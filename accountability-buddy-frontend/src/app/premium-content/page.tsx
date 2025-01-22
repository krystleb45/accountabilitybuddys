'use client';

import React from 'react';

const PremiumContentPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Unlock Premium Features
        </h1>
        <p className="text-lg text-gray-600">
          Take your experience to the next level with exclusive tools and
          benefits.
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Advanced Goal Analytics
          </h2>
          <p className="text-gray-700">
            Get detailed insights into your progress and performance.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Personalized Support
          </h2>
          <p className="text-gray-700">
            Enjoy one-on-one coaching and expert guidance.
          </p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Exclusive Rewards
          </h2>
          <p className="text-gray-700">
            Earn badges, points, and perks as you achieve your goals.
          </p>
        </section>

        <div className="text-center">
          <button className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
            Upgrade to Premium
          </button>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights
        reserved.
      </footer>
    </div>
  );
};

export default PremiumContentPage;
