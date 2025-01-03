import React, { useEffect, useState } from "react";
import { fetchBadges, fetchUserProgress } from "../services/gamificationService";
import { Badge, UserProgress } from "../types/Gamification"; // Import centralized types
import ProgressTracker from "./ProgressTracker";
import Notification from "./Notification";
import "./BadgeSystem.css";

interface User {
  id: string;
}

interface BadgeSystemProps {
  user: User;
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({ user }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [progress, setProgress] = useState<number>(0); // Track progress as a number
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserBadgesAndProgress = async () => {
      setLoading(true);
      setError(null);

      try {
        const userBadges: Badge[] = await fetchBadges(user.id);
        setBadges(userBadges);

        const userProgress: UserProgress = await fetchUserProgress(user.id);
        setProgress(userProgress.points); // Access `points` field for progress

        if (userBadges.length > badges.length) {
          setNewBadge(userBadges[userBadges.length - 1]);
        }
      } catch (err) {
        setError("Failed to load badges and progress. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getUserBadgesAndProgress();
  }, [user.id, badges.length]);

  return (
    <div className="badge-system">
      <h2>Badge System</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <ProgressTracker progress={progress} /> {/* Use progress directly */}
          <div className="badges">
            {badges.map((badge) => (
              <div key={badge.id} className="badge">
                <img src={badge.imageUrl} alt={badge.name} /> {/* Use imageUrl */}
                <h3>{badge.name}</h3>
                <p>{badge.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {newBadge && (
        <Notification message={`Congratulations! You've earned the ${newBadge.name} badge!`} />
      )}
    </div>
  );
};

export default BadgeSystem;
