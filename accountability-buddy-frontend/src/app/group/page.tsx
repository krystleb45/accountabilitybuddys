"use client";

import React, { useState } from "react";

const GroupPage: React.FC = () => {
  const [groups] = useState([
    { id: "1", name: "Fitness Buddies", members: 20 },
    { id: "2", name: "Study Partners", members: 50 },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Groups</h1>
      <ul className="space-y-4">
        {groups.map((group) => (
          <li
            key={group.id}
            className="p-4 bg-white shadow-lg rounded-lg flex justify-between"
          >
            <span>{group.name}</span>
            <span>{group.members} members</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupPage;
