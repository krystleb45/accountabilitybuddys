import React, { useEffect, useState } from "react";
import axios from "axios";
import "./RecentActivities.css"; // Optional: Add custom CSS for styling

interface Activity {
  id: string;
  name: string;
  description: string;
  date: string;
}

const RecentActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRecentActivities = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/activities/recent`);
        setActivities(response.data);
      } catch (err) {
        setError("Failed to load recent activities. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  return (
    <div className="recent-activities" role="region" aria-live="polite">
      <h2>Recent Activities</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
              <p className="activity-date">{new Date(activity.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent activities found.</p>
      )}
    </div>
  );
};

export default RecentActivities;
