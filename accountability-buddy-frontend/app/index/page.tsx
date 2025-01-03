import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link"; // Import Link from Next.js

const HomePage: React.FC = () => {
  return (
    <>
      {/* Head Section for Meta Tags */}
      <Head>
        <title>Accountability Buddy - Home</title>
        <meta
          name="description"
          content="Welcome to Accountability Buddy, where your goals meet a supportive community to achieve your personal and professional goals."
        />
        <meta
          name="keywords"
          content="accountability, goals, community, productivity, success, motivation"
        />
        <meta property="og:title" content="Accountability Buddy - Home" />
        <meta
          property="og:description"
          content="Achieve your goals with the help of a supportive community at Accountability Buddy."
        />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:url" content="https://www.accountabilitybuddy.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Accountability Buddy - Home" />
        <meta
          name="twitter:description"
          content="Join a supportive community focused on goal achievement and personal growth."
        />
        <meta name="twitter:image" content="/logo.png" />
      </Head>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 text-white p-10">
        {/* Header Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-4">
            Welcome to Accountability Buddy!
          </h1>
          <p className="text-lg">
            Track your goals and stay accountable with ease.
          </p>
        </header>

        {/* Navigation Buttons */}
        <main className="flex flex-col items-center gap-6">
          <Link href="/dashboard">
            <a
              className="bg-white text-blue-500 font-semibold py-3 px-6 rounded-full hover:bg-blue-100 transition-colors"
              role="button"
              aria-label="Go to Dashboard"
            >
              Go to Dashboard
            </a>
          </Link>
          <Link href="/register">
            <a
              className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-orange-600 transition-colors"
              role="button"
              aria-label="Register Now"
            >
              Register Now
            </a>
          </Link>
          <Link href="/login">
            <a
              className="bg-green-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-green-600 transition-colors"
              role="button"
              aria-label="Login"
            >
              Login
            </a>
          </Link>
        </main>

        {/* Footer Section */}
        <footer className="mt-12 text-sm text-gray-200">
          <p>Made with ❤️ using Next.js and Tailwind CSS</p>
        </footer>
      </div>
    </>
  );
};

// Redirect Component for Index Page
const IndexRedirect: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/homepage"); // Redirect to the homepage or any default page
  }, [router]);

  return null;
};

export default HomePage;
