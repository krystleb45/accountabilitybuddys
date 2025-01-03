import React, { useState, useEffect } from "react";
import { fetchLeaderboard, LeaderboardEntry } from "../services/gamificationService";
import LoadingSpinner from "./LoadingSpinner";
import "./Leaderboard.css";

interface LeaderboardProps {
  userId: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ userId }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch leaderboard data
  const loadLeaderboard = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchLeaderboard(userId);
      setLeaderboard(data);
    } catch (err: any) {
      console.error("Error fetching leaderboard:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load the leaderboard. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [userId]);

  const handleRetry = () => {
    loadLeaderboard();
  };

  return (
    <div className="leaderboard" role="region" aria-label="Leaderboard">
      <h2 className="leaderboard-title">Leaderboard</h2>

      {loading && <LoadingSpinner size={40} color="#007bff" loading={true} />}

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

      {!loading && !error && leaderboard.length > 0 ? (
        <ul className="leaderboard-list" aria-live="polite">
          {leaderboard.map((entry, index) => (
            <li key={entry.userId} className="leaderboard-item">
              {index + 1}. <strong>{entry.displayName}</strong> - {entry.score} points
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
