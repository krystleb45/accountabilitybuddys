import React from 'react';
import ActivityItem from './ActivityItem';
import './ActivityList.css'; // Optional CSS for styling

interface Activity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ActivityListProps {
  activities: Activity[]; // Array of activities to display
  onViewDetails: (id: string) => void; // Callback for viewing activity details
  onEdit: (id: string) => void; // Callback for editing an activity
  onDelete: (id: string) => void; // Callback for deleting an activity
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  if (activities.length === 0) {
    return (
      <p className="activity-list-empty">
        No activities found. Add some to get started!
      </p>
    );
  }

  return (
    <div className="activity-list">
      {activities.map((activity) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ActivityList;
