import React from "react";
import "./Dashboard.css"; // Optional CSS for styling

// Define types for props
interface UserStats {
  totalGoals: number;
  completedGoals: number;
  collaborations: number;
}

interface DashboardProps {
  userStats: UserStats;
  recentActivities: string[];
  onAction: (actionType: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userStats,
  recentActivities,
  onAction,
}) => {
  return (
    <div className="dashboard" role="region" aria-labelledby="dashboard-header">
      <h2 id="dashboard-header">Welcome to Your Dashboard</h2>

      {/* User Statistics */}
      <section
        className="user-stats"
        role="region"
        aria-labelledby="user-stats-header"
      >
        <h3 id="user-stats-header">User Statistics</h3>
        <ul>
          <li>Total Goals: {userStats?.totalGoals || 0}</li>
          <li>Completed Goals: {userStats?.completedGoals || 0}</li>
          <li>Collaborations: {userStats?.collaborations || 0}</li>
        </ul>
      </section>

      {/* Recent Activities */}
      <section
        className="recent-activities"
        role="region"
        aria-labelledby="recent-activities-header"
      >
        <h3 id="recent-activities-header">Recent Activities</h3>
        <ul>
          {recentActivities && recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))
          ) : (
            <p>No recent activities found.</p>
          )}
        </ul>
      </section>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <button
          onClick={() => onAction("newGoal")}
          aria-label="Create a New Goal"
          className="action-button"
        >
          Create New Goal
        </button>
        <button
          onClick={() => onAction("viewGoals")}
          aria-label="View All Goals"
          className="action-button"
        >
          View All Goals
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
