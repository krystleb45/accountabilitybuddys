"use client"; // Mark as Client Component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const NotFoundPage: React.FC = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(5); // Countdown state

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Redirect to homepage after 5 seconds
    const redirectTimeout = setTimeout(() => {
      router.push("/");
    }, 5000);

    // Cleanup timers
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-yellow-100 p-8">
      <div className="text-center">
        <h2
          className="text-4xl font-bold text-red-600 mb-4"
          role="alert"
          aria-live="assertive"
        >
          404 - Page Not Found
        </h2>
        <p className="text-lg mb-4">
          The page you are looking for does not exist.
        </p>
        <p className="text-base mb-6">
          Redirecting to the homepage in {countdown} seconds...
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
