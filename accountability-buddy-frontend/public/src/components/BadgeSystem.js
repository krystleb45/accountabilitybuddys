import React, { useEffect, useState } from 'react';
import { fetchBadges, fetchUserProgress } from '../services/gamificationService'; // Replace with your API service
import ProgressTracker from './ProgressTracker'; // Progress tracking component
import Notification from './Notification'; // Notification component
import './BadgeSystem.css';

const BadgeSystem = ({ user }) => {
  const [badges, setBadges] = useState([]);
  const [newBadge, setNewBadge] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user badges and progress from API
  useEffect(() => {
    const getUserBadgesAndProgress = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch badges
        const userBadges = await fetchBadges(user.id);
        setBadges(userBadges);

        // Fetch user progress
        const userProgress = await fetchUserProgress(user.id);
        setProgress(userProgress);
      } catch (err) {
        console.error('Failed to fetch badges or progress:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getUserBadgesAndProgress();
  }, [user.id]);

  // Monitor progress for new badge conditions
  useEffect(() => {
    if (progress >= 30 && !badges.find(badge => badge.name === '30-Day Streak')) {
      const newStreakBadge = {
        id: badges.length + 1,
        name: '30-Day Streak',
        description: 'Maintain a 30-day streak',
        icon: '/icons/30-day-streak.png',
      };

      setBadges([...badges, newStreakBadge]);
      setNewBadge(newStreakBadge); // Trigger notification
    }
  }, [progress, badges]);

  if (loading) {
    return <p aria-live="polite">Loading your achievements...</p>;
  }

  if (error) {
    return (
      <p role="alert" aria-live="assertive" style={{ color: 'red' }}>
        {error}
      </p>
    );
  }

  return (
    <div className="badge-system" role="region" aria-label="User Achievements and Progress">
      <h3>Your Achievements</h3>

      {/* Progress Tracker */}
      <div className="progress-tracker" role="region" aria-label="Progress Tracker">
        <ProgressTracker progress={progress} />
      </div>

      {/* Badge List */}
      <ul className="badge-list" role="region" aria-label="Badges">
        {badges.map((badge) => (
          <li key={badge.id} className="badge-item">
            <img
              src={badge.icon}
              alt={`${badge.name} badge`}
              className="badge-icon"
              loading="lazy"
            />
            <div className="badge-info">
              <h4>{badge.name}</h4>
              <p>{badge.description}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Notification for newly earned badge */}
      {newBadge && (
        <Notification message={`New Badge Earned: ${newBadge.name}`} />
      )}
    </div>
  );
};

export default BadgeSystem;
