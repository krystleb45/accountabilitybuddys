import React, { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../services/gamificationService';
import LoadingSpinner from './LoadingSpinner'; // Import the reusable loading spinner
import './Leaderboard.css';

const Leaderboard = ({ userId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch leaderboard data
  const loadLeaderboard = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchLeaderboard(userId);
      setLeaderboard(data);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load the leaderboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(); // Load leaderboard on component mount
  }, [userId]);

  // Handle retry for loading data
  const handleRetry = () => {
    loadLeaderboard();
  };

  return (
    <div className="leaderboard" role="region" aria-label="Leaderboard">
      <h2 className="leaderboard-title">Leaderboard</h2>

      {/* Display loading spinner */}
      {loading && <LoadingSpinner size={40} color="#007bff" loading={true} />}

      {/* Display error message with retry option */}
      {error && (
        <div role="alert" aria-live="assertive" className="leaderboard-error">
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="retry-button"
            aria-label="Retry fetching leaderboard"
          >
            Retry
          </button>
        </div>
      )}

      {/* Display leaderboard data */}
      {!loading && !error && leaderboard.length > 0 ? (
        <ul className="leaderboard-list" aria-live="polite">
          {leaderboard.map((user, index) => (
            <li key={user.id} className="leaderboard-item">
              {index + 1}. <strong>{user.name}</strong> - {user.points} points
            </li>
          ))}
        </ul>
      ) : !loading && !error && leaderboard.length === 0 ? (
        <p className="no-data-message">No leaderboard data available.</p>
      ) : null}
    </div>
  );
};

export default Leaderboard;
