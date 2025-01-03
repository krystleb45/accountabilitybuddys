import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import RecentActivities from '../components/RecentActivities'; // Component to show recent activities
import GroupRecommendations from '../components/GroupRecommendations'; // Group recommendations component
import GoalProgress from '../components/GoalProgress'; // Display user's goal progress
import LoadingSpinner from '../components/LoadingSpinner'; // Component for loading spinner
import axios from 'axios';

const HomePage = () => {
  const { authToken } = useContext(AuthContext); // Get the auth token from the context
  const [username, setUsername] = useState(''); // State for the user's name
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(''); // Error state for data fetching

  // Fetch user information when the page loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (response.data.success) {
          setUsername(response.data.user.username);
        } else {
          setError('Failed to fetch user data.');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('An error occurred while loading your profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [authToken]);

  return (
    <div className="home-page" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Welcome, {username ? username : 'User'}!</h1>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="goal-progress-section" style={{ marginBottom: '30px' }}>
            <GoalProgress />
          </section>

          <section className="recent-activities-section" style={{ marginBottom: '30px' }}>
            <h2>Recent Activities</h2>
            <RecentActivities />
          </section>

          <section className="group-recommendations-section">
            <h2>Group Recommendations</h2>
            <GroupRecommendations />
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;
