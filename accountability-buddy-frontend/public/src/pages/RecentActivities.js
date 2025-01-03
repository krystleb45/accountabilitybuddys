import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="spinner" aria-busy="true" aria-live="polite" style={{ textAlign: 'center', margin: '20px' }}>
    <div className="spinner-circle" style={{ width: '30px', height: '30px', border: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <p>Loading...</p>
  </div>
);

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch recent activities
  const fetchActivities = async () => {
    setLoading(true);
    setError(''); // Clear any previous error
    try {
      const res = await axios.get('https://accountabilitybuddys.com/api/activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Failed to fetch recent activities:', err);
      setError(err.response?.data?.message || 'Failed to load recent activities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="recent-activities-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Recent Activities</h1>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No recent activities found.</p>
      )}

      <ul className="activity-list" style={{ listStyleType: 'none', padding: '0' }}>
        {activities.map((activity, index) => (
          <li
            key={index}
            className="activity-item"
            style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <strong>{activity.title}</strong>
            <p>{activity.description}</p>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              {new Date(activity.date).toLocaleDateString()} - {new Date(activity.date).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;
