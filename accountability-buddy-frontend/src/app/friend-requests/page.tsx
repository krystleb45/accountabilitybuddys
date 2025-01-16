import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Placeholder API URL
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

interface FriendRequest {
  id: string;
  name: string;
}

const FriendRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchFriendRequests = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get<FriendRequest[]>(`${API_URL}/friend-requests`);
        setRequests(response.data);
      } catch (err) {
        console.error('Error fetching friend requests:', err);
        setError('Failed to load friend requests. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      await axios.post(`${API_URL}/friend-requests/${requestId}/accept`);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error('Error accepting request:', err);
      alert('Failed to accept the request. Please try again.');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await axios.post(`${API_URL}/friend-requests/${requestId}/reject`);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert('Failed to reject the request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Friend Requests</h1>
      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : requests.length > 0 ? (
        <ul className="w-full max-w-lg list-none p-0">
          {requests.map((req) => (
            <li key={req.id} className="flex justify-between items-center bg-white p-4 mb-4 rounded-lg shadow-md">
              <span className="text-gray-800 font-medium">{req.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(req.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-lg text-gray-600">No friend requests found.</p>
      )}
    </div>
  );
};

export default FriendRequestsPage;
