import React from 'react';
import styles from './BadgeSystem.module.css'; // Ensure you have this file for styling

interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

interface BadgeSystemProps {
  badges: Badge[];
}

const BadgeSystem: React.FC<BadgeSystemProps> = ({ badges }) => {
  return (
    <div className={styles.badgeSystemContainer}>
      {badges.length === 0 ? (
        <p className={styles.emptyMessage} role="alert">
          No badges available.
        </p>
      ) : (
        <ul className={styles.badgeList} aria-label="List of badges">
          {badges.map((badge) => (
            <li key={badge.id} className={styles.badgeItem}>
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
