import React, { useState, useEffect } from 'react';
import GamificationService, {
  LeaderboardEntry,
} from '../../services/gamificationService'; // Use default export for fetchLeaderboard
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'; // Import a reusable loading spinner component
import './Leaderboard.css';

// Define props interface
interface LeaderboardProps {
  userId: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ userId }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]); // State for leaderboard data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string>(''); // State for error message

  // Fetch leaderboard data
  const loadLeaderboard = async (): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      const data: LeaderboardEntry[] | undefined =
        await GamificationService.fetchLeaderboard(userId); // Fetch leaderboard data
      setLeaderboard(data || []); // Ensure fallback to an empty array if data is undefined
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load the leaderboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(); // Load leaderboard when component mounts or userId changes
  }, [userId]);

  // Handle retry for loading data
  const handleRetry = (): void => {
    loadLeaderboard();
  };

  return (
    <div
      className="leaderboard-container"
      role="region"
      aria-label="Leaderboard"
      data-testid="leaderboard"
    >
      <h2 className="leaderboard-title">Leaderboard</h2>

      {/* Display loading spinner */}
      {loading && (
        <LoadingSpinner
          size={40}
          color="#007bff"
          loading={true}
          data-testid="loading-spinner"
        />
      )}

      {/* Display error message with retry option */}
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="leaderboard-error"
          data-testid="error-message"
        >
          <p>{error}</p>
          <button
            onClick={handleRetry}
            className="retry-button"
            aria-label="Retry fetching leaderboard"
            data-testid="retry-button"
          >
            Retry
          </button>
        </div>
      )}

      {/* Display leaderboard data */}
      {!loading && !error && leaderboard.length > 0 ? (
        <table
          className="leaderboard-table"
          aria-live="polite"
          data-testid="leaderboard-table"
        >
          <thead>
            <tr>
              <th className="leaderboard-rank">Rank</th>
              <th>Name</th>
              <th className="leaderboard-score">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr
                key={user.userId}
                className={`leaderboard-item ${
                  user.userId === userId ? 'current-user' : ''
                }`}
                data-testid="leaderboard-row"
              >
                <td className="leaderboard-rank">{index + 1}</td>
                <td>{user.displayName}</td>
                <td className="leaderboard-score">{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : !loading && !error && leaderboard.length === 0 ? (
        <p className="no-data-message" data-testid="no-data-message">
          No leaderboard data available.
        </p>
      ) : null}
    </div>
  );
};

export default Leaderboard;
