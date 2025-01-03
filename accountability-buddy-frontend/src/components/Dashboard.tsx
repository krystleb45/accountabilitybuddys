import React from "react";
import "./Dashboard.css"; // Optional CSS for styling

interface UserStats {
  totalGoals: number;
  completedGoals: number;
  collaborations: number;
}

interface DashboardProps {
  userStats: UserStats;
  recentActivities: string[];
  onAction: (action: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userStats, recentActivities, onAction }) => {
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
              <li key={index}>{activity}</li>
            ))
          ) : (
            <p>No recent activities found.</p>
          )}
        </ul>
      </section>

      {/* Example action button */}
      <button onClick={() => onAction("exampleAction")}>Perform Action</button>
    </div>
  );
};

export default Dashboard;
