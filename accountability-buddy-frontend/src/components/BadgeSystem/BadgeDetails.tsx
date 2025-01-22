import React from 'react';
import './BadgeDetails.css'; // Optional CSS for styling

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // URL or path to the badge icon
  criteria: string; // Explanation of how to earn the badge
  dateEarned?: string; // Optional: Date when the badge was earned
}

interface BadgeDetailsProps {
  badge: Badge; // Badge data to display
  onClose: () => void; // Callback to close the badge details view
}

const BadgeDetails: React.FC<BadgeDetailsProps> = ({ badge, onClose }) => {
  return (
    <div className="badge-details">
      <div className="badge-header">
        <img
          src={badge.icon}
          alt={`${badge.name} badge`}
          className="badge-icon"
        />
        <h2 className="badge-name">{badge.name}</h2>
      </div>
      <p className="badge-description">{badge.description}</p>
      <div className="badge-criteria">
        <h4>How to Earn:</h4>
        <p>{badge.criteria}</p>
      </div>
      {badge.dateEarned && (
        <p className="badge-date">
          Earned on:{' '}
          <strong>{new Date(badge.dateEarned).toLocaleDateString()}</strong>
        </p>
      )}
      <button
        onClick={onClose}
        className="close-button"
        aria-label="Close badge details"
      >
        Close
      </button>
    </div>
  );
};

export default BadgeDetails;
