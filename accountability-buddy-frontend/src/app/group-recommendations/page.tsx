"use client";

import React, { useState } from "react";

const GroupRecommendationsPage: React.FC = () => {
  const [recommendations] = useState([
    { id: "1", name: "Project Enthusiasts", description: "For project lovers." },
    { id: "2", name: "Goal Setters", description: "For goal achievers." },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Group Recommendations
      </h1>
      <ul className="space-y-4">
        {recommendations.map((group) => (
          <li
            key={group.id}
            className="p-4 bg-white shadow-lg rounded-lg flex justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold">{group.name}</h3>
              <p>{group.description}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Join Group
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupRecommendationsPage;
