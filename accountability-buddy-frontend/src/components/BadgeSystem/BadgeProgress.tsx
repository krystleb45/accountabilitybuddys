import React from 'react';
import './BadgeProgress.css'; // Optional CSS for styling

interface BadgeProgressProps {
  badgeName: string; // Name of the badge
  progress: number; // Progress as a percentage (0 to 100)
  criteria: string; // Description of the criteria to earn the badge
}

const BadgeProgress: React.FC<BadgeProgressProps> = ({
  badgeName,
  progress,
  criteria,
}) => {
  return (
    <div className="badge-progress">
      <h3 className="badge-progress-title">{badgeName}</h3>
      <p className="badge-progress-criteria">{criteria}</p>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
          aria-label={`${progress}% progress toward earning the ${badgeName} badge`}
        ></div>
      </div>
      <p className="progress-percentage">{progress}% Complete</p>
    </div>
  );
};

export default BadgeProgress;
