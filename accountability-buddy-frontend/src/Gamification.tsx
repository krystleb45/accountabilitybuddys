import React, { useEffect, useState } from "react";
import BadgeSystem from "./BadgeSystem";
import ProgressTracker from "./ProgressTracker";
import Leaderboard from "./Leaderboard"; // Ensure Leaderboard supports required props
import Notification from "./notifications/Notification"; // Notification for new badges
import { fetchUserProgress } from "../src/services/gamificationService"; // Adjust path to service
import { UserProgress } from "../src/types/Gamification"; // Import type directly
import "./Gamification.css";

// Define types for props and state
interface User {
  id: string;
  name: string;
  email: string; // Ensure email field matches BadgeSystemProps
}

interface GamificationProps {
  user: User;
}

const Gamification: React.FC<GamificationProps> = ({ user }) => {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [newBadge, setNewBadge] = useState<string | null>(null);

  // Fetch user progress from the backend
  useEffect(() => {
    const getUserProgress = async () => {
      setLoading(true);
      setError("");

      try {
        const userProgress: UserProgress = await fetchUserProgress(user.id);

        // Ensure userProgress has the correct shape
        setProgress(userProgress.points); // Map `points` to progress

        // Check if newBadge exists and has a name
        if (userProgress.newBadge && typeof userProgress.newBadge.name === "string") {
          setNewBadge(userProgress.newBadge.name);
        } else {
          setNewBadge(null); // Reset if no new badge
        }
      } catch (err) {
        console.error("Failed to fetch user progress:", err);
        setError("Failed to load gamification data.");
      } finally {
        setLoading(false);
      }
    };

    getUserProgress();
  }, [user.id]);

  return (
    <div className="gamification" role="region" aria-labelledby="gamification-header">
      <h2 id="gamification-header">Gamification</h2>
      {loading ? (
        <p>Loading gamification data...</p>
      ) : error ? (
        <p className="error-message" role="alert">{error}</p>
      ) : (
        <>
          <ProgressTracker progress={progress} />
          <BadgeSystem user={user} /> {/* Pass user with email */}
          <Leaderboard userId={user.id} /> {/* Pass the required userId prop */}
          {newBadge && (
            <Notification message={`You earned a new badge: ${newBadge}!`} />
          )}
        </>
      )}
    </div>
  );
};

export default Gamification;
