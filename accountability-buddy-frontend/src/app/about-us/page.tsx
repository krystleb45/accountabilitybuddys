"use client"; // Ensure it's a Client Component

import React from "react";

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-4">
            About Accountability Buddy
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Empowering individuals to achieve their goals through accountability and community.
          </p>
        </header>

        {/* Main Content */}
        <main>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              At Accountability Buddy, we believe in the power of support and consistency.
              Our mission is to help individuals achieve their personal and professional goals by
              providing a platform that encourages accountability and fosters a sense of community.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Goal tracking and progress analytics</li>
              <li>Personalized recommendations for accountability groups</li>
              <li>Engaging leaderboards and rewards</li>
              <li>Private and group chatrooms for support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Join Us</h2>
            <p className="text-gray-600">
              Join our growing community of goal-oriented individuals and start your accountability journey today.
              Together, we can achieve great things!
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AboutUsPage;
