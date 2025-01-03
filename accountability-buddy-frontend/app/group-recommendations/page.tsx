"use client"; // Mark as Client Component

import React, { useState } from "react";
import Link from "next/link"; // Import Link from Next.js

// Type definition for Group
interface Group {
  name: string;
  description: string;
}

// Group Recommendation Item component
const GroupRecommendationItem: React.FC<{
  group: Group;
  onJoin: () => void;
}> = ({ group, onJoin }) => (
  <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4">
    <h3 className="text-xl font-semibold text-gray-800">{group.name}</h3>
    <p className="text-gray-600 mt-2">{group.description}</p>
    <button
      onClick={onJoin}
      className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
      aria-label={`Join ${group.name}`}
    >
      Join Group
    </button>
  </div>
);

const GroupRecommendationsPage: React.FC = () => {
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null);

  // Mocked recommended groups
  const recommendedGroups: Group[] = [
    {
      name: "Early Risers",
      description: "A group for morning people who start their day early.",
    },
    {
      name: "Book Lovers",
      description:
        "Discuss your favorite books and get recommendations from others.",
    },
    {
      name: "Freelancers Hub",
      description:
        "Connect with other freelancers to share tips and resources.",
    },
    {
      name: "Wellness Warriors",
      description:
        "Focus on physical and mental well-being with this supportive group.",
    },
  ];

  const handleJoinGroup = (groupName: string) => {
    // Placeholder logic for joining a group
    console.log(`Joined group: ${groupName}`);
    setJoinedGroup(groupName);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-50 to-green-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Recommended Groups</h1>
        <nav className="flex gap-4">
          <Link href="/dashboard">
            <span className="text-blue-600 font-semibold hover:underline">Dashboard</span>
          </Link>
          <Link href="/profile">
            <span className="text-blue-600 font-semibold hover:underline">Profile</span>
          </Link>
        </nav>
      </header>

      {/* Recommended Groups List */}
      <main className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Join a Group that Matches Your Interests
        </h2>
        {joinedGroup ? (
          <div className="text-center text-green-600 mb-6">
            <h3 className="text-lg font-medium">Success!</h3>
            <p>
              You have joined the "
              <span className="font-bold">{joinedGroup}</span>" group.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendedGroups.map((group, index) => (
              <GroupRecommendationItem
                key={index}
                group={group}
                onJoin={() => handleJoinGroup(group.name)}
              />
            ))}
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

export default GroupRecommendationsPage;
