import React from 'react';
import './ActivityItem.css'; // Optional CSS for styling

interface Activity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ActivityItemProps {
  activity: Activity; // Activity data to display
  onViewDetails: (id: string) => void; // Callback for viewing activity details
  onEdit: (id: string) => void; // Callback for editing the activity
  onDelete: (id: string) => void; // Callback for deleting the activity
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="activity-item" role="listitem">
      <div className="activity-item-header">
        <h3 className="activity-item-title">{activity.title}</h3>
        <span
          className={`activity-item-status activity-item-status-${activity.status}`}
        >
          {activity.status}
        </span>
      </div>
      <p className="activity-item-description">{activity.description}</p>
      <p className="activity-item-meta">
        Created:{' '}
        <strong>{new Date(activity.createdAt).toLocaleDateString()}</strong>
      </p>
      <div className="activity-item-actions">
        <button
          className="activity-item-button view-details"
          onClick={() => onViewDetails(activity.id)}
        >
          View Details
        </button>
        <button
          className="activity-item-button edit"
          onClick={() => onEdit(activity.id)}
        >
          Edit
        </button>
        <button
          className="activity-item-button delete"
          onClick={() => onDelete(activity.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ActivityItem;
