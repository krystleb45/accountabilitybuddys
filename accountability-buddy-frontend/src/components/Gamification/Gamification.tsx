import React, { useEffect, useState } from "react";
import BadgeSystem from "./BadgeSystem";
import ProgressTracker from "../Progress/ProgressTracker";
import Leaderboard from "../Leaderboard";
import Notification from "../Notifications/Notification";
import { fetchUserProgress } from "../../services/gamificationService";
import { UserProgress } from "../../types/Gamification"; // Import the correct type
import "./Gamification.css";

interface User {
  id: string;
  name: string;
}

interface GamificationProps {
  user: User | null; // Allow `user` to be null
}

const Gamification: React.FC<GamificationProps> = ({ user }) => {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError("No user logged in. Please log in to view gamification.");
      setLoading(false);
      return;
    }

    const getUserProgress = async () => {
      setLoading(true);
      setError("");

      try {
        const userProgress: UserProgress = await fetchUserProgress(user.id);

        // Ensure `progress` and `newBadge` exist on the response
        setProgress(userProgress.points || 0); // Use `points` instead of `progress`
        if (userProgress.newBadge) {
          setNewBadge(userProgress.newBadge.name);
        }
      } catch (err) {
        console.error("Failed to fetch user progress:", err);
        setError("Failed to load progress. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getUserProgress();
  }, [user]);

  if (!user) {
    return <p className="error">Please log in to view gamification details.</p>;
  }

  return (
    <div className="gamification">
      <h2>Gamification</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <ProgressTracker progress={progress} />
          <BadgeSystem user={user} />
          <Leaderboard userId={user.id} />
        </>
      )}
      {newBadge && (
        <Notification message={`Congratulations! You've earned the ${newBadge} badge!`} />
      )}
    </div>
  );
};

export default Gamification;
