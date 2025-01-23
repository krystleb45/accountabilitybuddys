import React, { useEffect, useState } from 'react';
import './ActivityDetails.css'; // Optional CSS for styling

interface Activity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  status?: 'pending' | 'in-progress' | 'completed';
}

interface ActivityDetailsProps {
  activityId: string; // ID of the activity to fetch details for
  fetchActivity: (id: string) => Promise<Activity>; // Function to fetch activity details
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activityId,
  fetchActivity,
}) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActivityDetails = async (): Promise<void> => {
      try {
        setLoading(true);
        const fetchedActivity = await fetchActivity(activityId);
        setActivity(fetchedActivity);
      } catch (err) {
        console.error('Error fetching activity details:', err);
        setError('Failed to load activity details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadActivityDetails();
  }, [activityId, fetchActivity]);

  if (loading) {
    return (
      <p className="activity-details-loading">Loading activity details...</p>
    );
  }

  if (error) {
    return <p className="activity-details-error">{error}</p>;
  }

  if (!activity) {
    return <p className="activity-details-not-found">Activity not found.</p>;
  }

  return (
    <div className="activity-details">
      <h2 className="activity-title">{activity.title}</h2>
      <p className="activity-description">{activity.description}</p>
      <p className="activity-meta">
        Created At:{' '}
        <strong>{new Date(activity.createdAt).toLocaleDateString()}</strong>
      </p>
      {activity.updatedAt && (
        <p className="activity-meta">
          Last Updated:{' '}
          <strong>{new Date(activity.updatedAt).toLocaleDateString()}</strong>
        </p>
      )}
      {activity.tags && activity.tags.length > 0 && (
        <div className="activity-tags">
          <h4>Tags:</h4>
          <ul>
            {activity.tags.map((tag) => (
              <li key={tag} className="activity-tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
      {activity.status && (
        <p className={`activity-status activity-status-${activity.status}`}>
          Status: <strong>{activity.status}</strong>
        </p>
      )}
    </div>
  );
};

export default ActivityDetails;
