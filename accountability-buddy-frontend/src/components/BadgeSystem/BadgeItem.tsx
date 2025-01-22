import React from 'react';
import './BadgeItem.css'; // Optional CSS for styling

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // URL or path to the badge icon
  dateEarned?: string; // Optional: Date when the badge was earned
  isEarned: boolean; // Indicates whether the badge is earned
}

interface BadgeItemProps {
  badge: Badge; // Badge data to display
  onClick: (id: string) => void; // Callback when the badge is clicked
}

const BadgeItem: React.FC<BadgeItemProps> = ({ badge, onClick }) => {
  return (
    <div
      className={`badge-item ${badge.isEarned ? 'earned' : 'not-earned'}`}
      onClick={() => onClick(badge.id)}
      role="button"
      tabIndex={0}
      aria-label={`Badge: ${badge.name}`}
      onKeyPress={(e) => e.key === 'Enter' && onClick(badge.id)}
    >
      <img
        src={badge.icon}
        alt={`${badge.name} badge`}
        className="badge-icon"
      />
      <h3 className="badge-name">{badge.name}</h3>
      {badge.isEarned && badge.dateEarned && (
        <p className="badge-date">
          Earned on:{' '}
          <strong>{new Date(badge.dateEarned).toLocaleDateString()}</strong>
        </p>
      )}
      {!badge.isEarned && <p className="badge-status">Not Earned Yet</p>}
    </div>
  );
};

export default BadgeItem;
