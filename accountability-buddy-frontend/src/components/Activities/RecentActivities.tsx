import React from 'react';

interface RecentActivity {
  id: string;
  description: string;
  timestamp: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <p className="recent-activities-empty">No recent activities</p>;
  }

  return (
    <div className="recent-activities-container">
      <h3>Recent Activities</h3>
      <ul className="recent-activities-list">
        {activities.map((activity) => (
          <li key={activity.id} className="recent-activity-item">
            <p className="recent-activity-description">{activity.description}</p>
            <span className="recent-activity-timestamp">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
