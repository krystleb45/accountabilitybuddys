import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import RecentActivities from '../components/RecentActivities'; // Component for recent activities
import GoalProgress from '../components/GoalProgress'; // Component for goal progress
import Notifications from '../components/Notifications'; // Component for notifications
import GroupRecommendations from '../components/GroupRecommendations'; // For personalized group suggestions
import CustomReminders from '../components/CustomReminders'; // Component to display custom reminders
import LoadingSpinner from '../components/LoadingSpinner'; // Loading spinner during data fetch

const DashboardPage = () => {
  const { authToken } = useContext(AuthContext); // Auth context for user authentication state
  const { user, loading, error, refreshUserProfile } = useContext(UserContext); // User context for user details

  // Refresh user profile on component mount
  useEffect(() => {
    if (authToken) {
      refreshUserProfile();
    }
  }, [authToken, refreshUserProfile]);

  return (
    <div className="dashboard-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Welcome to Your Dashboard, {user?.username || 'User'}!</h1>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Goal Progress Section */}
          <section className="goal-progress-section" style={{ marginBottom: '30px' }}>
            <h2>Goal Progress</h2>
            <GoalProgress />
          </section>

          {/* Recent Activities Section */}
          <section className="recent-activities-section" style={{ marginBottom: '30px' }}>
            <h2>Recent Activities</h2>
            <RecentActivities />
          </section>

          {/* Notifications Section */}
          <section className="notifications-section" style={{ marginBottom: '30px' }}>
            <h2>Notifications</h2>
            <Notifications />
          </section>

          {/* Group Recommendations Section */}
          <section className="group-recommendations-section" style={{ marginBottom: '30px' }}>
            <h2>Group Recommendations</h2>
            <GroupRecommendations />
          </section>

          {/* Custom Reminders Section */}
          <section className="custom-reminders-section">
            <h2>Custom Reminders</h2>
            <CustomReminders />
          </section>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
