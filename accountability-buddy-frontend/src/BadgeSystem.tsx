import React, { useEffect, useState } from "react";
import { fetchBadges } from "../src/services/gamificationService"; // Adjust path as needed
import "./BadgeSystem.css";

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string; // Ensure it matches the transformed API response
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface BadgeSystemProps {
  user: User;
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({ user }) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getUserBadges = async () => {
      setLoading(true);
      setError("");

      try {
        const userBadges = await fetchBadges(user.id);
        setBadges(userBadges);
      } catch (err) {
        console.error("Failed to fetch badges:", err);
        setError("Failed to load badges. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getUserBadges();
  }, [user.id]);

  return (
    <div className="badge-system" role="region" aria-labelledby="badge-system-header">
      <h2 id="badge-system-header">Badge System</h2>
      {loading ? (
        <p>Loading badges...</p>
      ) : error ? (
        <p className="error-message" role="alert">
          {error}
        </p>
      ) : (
        <div className="badges-container">
          {badges.length > 0 ? (
            badges.map((badge) => (
              <div key={badge.id} className="badge">
                <img src={badge.imageUrl} alt={badge.name} />
                <p>{badge.name}</p>
              </div>
            ))
          ) : (
            <p>No badges earned yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BadgeSystem;
