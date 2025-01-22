import React from "react";
import styles from "./BadgeSystem.module.css"; // Ensure this file exists

// Define the Badge interface
interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// Define the User interface
interface User {
  id: string;
  name: string;
}

// Define the BadgeSystemProps interface
interface BadgeSystemProps {
  badges: Badge[]; // List of badges to display
  user: User; // User details for contextual rendering
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({ badges, user }) => {
  return (
    <div className={styles.badgeSystemContainer} data-testid="badge-system">
      <h2 className={styles.userGreeting}>Badges for {user.name}</h2>
      {badges.length === 0 ? (
        <p className={styles.emptyMessage} role="alert" data-testid="empty-message">
          No badges available.
        </p>
      ) : (
        <ul className={styles.badgeList} aria-label="List of badges">
          {badges.map((badge) => (
            <li key={badge.id} className={styles.badgeItem} data-testid="badge-item">
              <img
                src={badge.imageUrl}
                alt={badge.description}
                className={styles.badgeImage}
              />
              <div className={styles.badgeDetails}>
                <h3 className={styles.badgeName}>{badge.name}</h3>
                <p className={styles.badgeDescription}>{badge.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BadgeSystem;
