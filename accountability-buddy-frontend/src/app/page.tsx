import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 sm:p-20 gap-16 font-sans bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <header className="flex flex-col items-center gap-4">
        <Image
          src="/your-logo.svg" // Replace with your logo path
          alt="Accountability Buddy Logo"
          width={180}
          height={38}
          priority
          className="dark:invert"
        />
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Welcome to Accountability Buddy!
        </h1>
        <p className="text-lg text-center text-gray-700 max-w-lg">
          Stay on track with your goals and connect with accountability partners
          for a successful journey.
        </p>
      </header>

      {/* Main Navigation Section */}
      <main className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <Link
          href="/register"
          className="rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors py-3 px-8 text-sm sm:text-base flex items-center justify-center"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="rounded-full border border-gray-300 text-gray-600 hover:bg-gray-200 transition-colors py-3 px-8 text-sm sm:text-base flex items-center justify-center"
        >
          Login
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors py-3 px-8 text-sm sm:text-base flex items-center justify-center"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/settings"
          className="rounded-full border border-gray-300 text-gray-600 hover:bg-gray-200 transition-colors py-3 px-8 text-sm sm:text-base flex items-center justify-center"
        >
          Manage Settings
        </Link>
      </main>

      {/* Footer Section */}
      <footer className="flex gap-6 items-center justify-center mt-auto pb-8">
        <a
          href="https://github.com/krystleb45/accountability-buddy-frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline"
        >
          <Image
            src="/github-icon.svg" // Replace with GitHub icon path
            alt="GitHub"
            width={16}
            height={16}
          />
          GitHub Repository
        </a>
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline"
        >
          <Image
            src="/vercel-icon.svg" // Replace with Vercel icon path
            alt="Vercel"
            width={16}
            height={16}
          />
          Powered by Vercel
        </a>
      </footer>
    </div>
  );
};

export default HomePage;
