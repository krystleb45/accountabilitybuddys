import React, { useEffect, useState } from 'react';
import BadgeSystem from './BadgeSystem';
import ProgressTracker from './ProgressTracker';
import Leaderboard from './Leaderboard'; // Include the Leaderboard component
import Notification from './Notification'; // Notification for new badges
import { fetchUserProgress } from '../services/gamificationService'; // Fetch progress from backend
import './Gamification.css'; // Styling for the gamification components

const Gamification = ({ user }) => {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBadge, setNewBadge] = useState(null);

  // Fetch user progress from the backend
  useEffect(() => {
    const getUserProgress = async () => {
      setLoading(true);
      setError('');

      try {
        const userProgress = await fetchUserProgress(user.id);
        setProgress(userProgress);
      } catch (err) {
        console.error('Failed to fetch user progress:', err);
        setError('Unable to load user progress. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getUserProgress();
  }, [user.id]);

  // Handle new badge notifications
  const handleNewBadge = (badge) => {
    setNewBadge(badge);

    // Clear notification after 5 seconds
    setTimeout(() => setNewBadge(null), 5000);
  };

  // Render loading state
  if (loading) {
    return <p aria-live="polite">Loading gamification data...</p>;
  }

  // Render error state
  if (error) {
    return (
      <p role="alert" aria-live="assertive" style={{ color: 'red' }}>
        {error}
      </p>
    );
  }

  return (
    <div className="gamification" role="region" aria-label="Gamification Dashboard">
      <h2>Gamification Dashboard</h2>

      {/* Badge System with progress and new badge handling */}
      <BadgeSystem user={user} progress={progress} onNewBadge={handleNewBadge} />

      {/* Progress Tracker */}
      <div className="progress-section" role="region" aria-label="Progress Tracker">
        <ProgressTracker progress={progress} />
      </div>

      {/* Leaderboard Component */}
      <Leaderboard userId={user.id} />

      {/* Notification for newly earned badges */}
      {newBadge && (
        <Notification message={`You earned a new badge: ${newBadge.name}`} />
      )}
    </div>
  );
};

export default Gamification;
