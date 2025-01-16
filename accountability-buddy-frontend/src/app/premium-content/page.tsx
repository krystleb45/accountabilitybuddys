"use client"; // Mark as Client Component

import React, { useState } from "react";
import Link from "next/link"; // Import Link from Next.js

// Premium Content Item Component
const PremiumContentItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4">
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
);

const PremiumContentPage: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  // List of Premium Content
  const premiumContents = [
    {
      title: "Advanced Goal-Setting Strategies",
      description:
        "Learn how to set more effective and achievable goals with advanced techniques.",
    },
    {
      title: "Weekly Accountability Webinars",
      description:
        "Join our exclusive webinars for personalized guidance and support.",
    },
    {
      title: "Access to Expert Mentors",
      description:
        "Get direct access to mentors who can help you stay accountable and achieve your goals.",
    },
  ];

  // Handle subscription
  const handleSubscribe = () => {
    // Placeholder logic for subscription
    console.log("User subscribed to premium content");
    setIsSubscribed(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Premium Content</h1>
        <nav className="flex gap-4">
          <Link href="/dashboard">
            <span className="text-blue-600 font-semibold hover:underline" aria-label="Go to Dashboard">
              Dashboard
            </span>
          </Link>
          <Link href="/profile">
            <span className="text-blue-600 font-semibold hover:underline" aria-label="Go to Profile">
              Profile
            </span>
          </Link>
        </nav>
      </header>

      {/* Premium Content Section */}
      <main className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {isSubscribed
            ? "Exclusive Content for Premium Members"
            : "Unlock Premium Content"}
        </h2>

        {isSubscribed ? (
          <div className="space-y-4">
            {premiumContents.map((content, index) => (
              <PremiumContentItem
                key={index} // Ideally use a unique identifier from the content data
                title={content.title}
                description={content.description}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700 mb-6">
            <p className="mb-4">
              Subscribe to access exclusive content, including advanced
              strategies, webinars, and mentoring.
            </p>
            <button
              onClick={handleSubscribe}
              className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Subscribe to Premium Content"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default PremiumContentPage;
