"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/router";

const LogoutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Perform logout
    const performLogout = () => {
      sessionStorage.clear();
      localStorage.clear();
      router.replace("/login"); // Prevent navigating back
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Logging Out...
        </h1>
        <p className="text-lg text-gray-600">You will be redirected shortly.</p>
      </div>
    </div>
  );
};

export default LogoutPage;
