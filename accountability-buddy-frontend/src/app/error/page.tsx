"use client"; // Ensure it's a Client Component

import React from "react";
import { useRouter } from "next/router";

const ErrorPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-8">
      <h1 className="text-4xl font-extrabold text-red-600 mb-4">
        Oops! Something went wrong.
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Please try again or go back to the homepage.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all"
        aria-label="Go to Homepage"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default ErrorPage;
