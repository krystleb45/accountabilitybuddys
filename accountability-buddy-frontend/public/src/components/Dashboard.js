import React from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css'; // Optional CSS for styling

const Dashboard = ({ userStats, recentActivities, onAction }) => {
  return (
    <div className="dashboard" role="region" aria-live="polite">
      <h2>Welcome to Your Dashboard</h2>

      {/* User Statistics */}
      <section className="user-stats">
        <h3>User Statistics</h3>
        <ul>
          <li>Total Goals: {userStats.totalGoals}</li>
          <li>Completed Goals: {userStats.completedGoals}</li>
          <li>Collaborations: {userStats.collaborations}</li>
        </ul>
      </section>

      {/* Recent Activities */}
      <section className="recent-activities">
        <h3>Recent Activities</h3>
        <ul>
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <li key={index}>
                {activity}
              </li>
            ))
          ) : (
            <p>No recent activities found.</p>
          )}
        </ul>
      </section>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <button onClick={() => onAction('newGoal')} aria-label="Create a New Goal">
          Create New Goal
        </button>
        <button onClick={() => onAction('viewGoals')} aria-label="View All Goals">
          View All Goals
        </button>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  userStats: PropTypes.shape({
    totalGoals: PropTypes.number,
    completedGoals: PropTypes.number,
    collaborations: PropTypes.number,
  }).isRequired,
  recentActivities: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAction: PropTypes.func.isRequired,
};

export default Dashboard;
