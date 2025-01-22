'use client';

import React from 'react';

const FriendRequestsPage: React.FC = () => {
  const requests = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ];

  const handleAccept = (id: number) => {
    console.log(`Accepted request from user ${id}`);
  };

  const handleReject = (id: number) => {
    console.log(`Rejected request from user ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Friend Requests</h1>
      <ul className="space-y-4">
        {requests.map((req) => (
          <li
            key={req.id}
            className="p-4 bg-white shadow-lg rounded-lg flex items-center justify-between"
          >
            <span className="text-gray-800">{req.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleAccept(req.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(req.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequestsPage;
