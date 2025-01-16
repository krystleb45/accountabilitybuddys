"use client"; // Mark as Client Component

import React from "react";
import Link from "next/link"; // Import Link from Next.js

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-6 shadow-md mb-8 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1>
        <nav className="flex gap-4">
          <Link href="/dashboard">
            <a className="text-blue-600 font-semibold hover:underline">Dashboard</a>
          </Link>
          <Link href="/settings">
            <a className="text-blue-600 font-semibold hover:underline">Settings</a>
          </Link>
        </nav>
      </header>

      {/* Terms of Service Content */}
      <main className="bg-white p-8 rounded-lg shadow-md">
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Accountability Buddy! By accessing or using our services,
            you agree to comply with and be bound by the following terms and
            conditions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
          <p className="text-gray-700 leading-relaxed">
            You are responsible for maintaining the confidentiality of your
            account and password and for restricting access to your account.
            You agree to accept responsibility for all activities that occur
            under your account.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use Policy</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Users must not use the service for any unlawful activities.</li>
            <li>Spamming, harassment, or abuse of any kind is strictly prohibited.</li>
            <li>Users must respect the intellectual property rights of others.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payments</h2>
          <p className="text-gray-700 leading-relaxed">
            Users may subscribe to our premium services. By subscribing, you
            agree to pay the applicable fees as described at the time of
            subscription. All payments are non-refundable.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">5. Modifications to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these terms at any time. Users will
            be notified of any changes, and continued use of the service will
            constitute acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these terms, please contact us at:{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline"
            >
              support@example.com
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default TermsOfServicePage;
