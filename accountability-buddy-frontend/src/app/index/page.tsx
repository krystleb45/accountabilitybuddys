'use client';

export default function Index(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Welcome to Accountability Buddy
      </h1>
      <p className="text-lg text-gray-600 text-center max-w-md">
        Empowering you to achieve your goals with personalized support, progress
        tracking, and a thriving community.
      </p>
      <a
        href="/dashboard"
        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        aria-label="Go to Dashboard"
      >
        Get Started
      </a>
    </div>
  );
}
