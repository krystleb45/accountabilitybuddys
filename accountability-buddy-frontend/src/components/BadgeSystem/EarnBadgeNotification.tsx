import React from 'react';
import './EarnBadgeNotification.css'; // Optional CSS for styling

interface EarnBadgeNotificationProps {
  badgeName: string; // Name of the badge earned
  badgeIcon: string; // URL or path to the badge icon
  message?: string; // Optional custom message to display
  onClose: () => void; // Callback to close the notification
  onViewDetails?: () => void; // Optional callback to view badge details
}

const EarnBadgeNotification: React.FC<EarnBadgeNotificationProps> = ({
  badgeName,
  badgeIcon,
  message = "Congratulations! You've earned a new badge!",
  onClose,
  onViewDetails,
}) => {
  return (
    <div className="earn-badge-notification" role="alert" aria-live="assertive">
      <div className="notification-content">
        <img
          src={badgeIcon}
          alt={`${badgeName} badge`}
          className="badge-icon"
        />
        <div>
          <h3 className="notification-title">{message}</h3>
          <p className="badge-name">Badge: {badgeName}</p>
        </div>
      </div>
      <div className="notification-actions">
        {onViewDetails && (
          <button
            className="notification-button view-details"
            onClick={onViewDetails}
            aria-label="View badge details"
          >
            View Details
          </button>
        )}
        <button
          className="notification-button close"
          onClick={onClose}
          aria-label="Close notification"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EarnBadgeNotification;
