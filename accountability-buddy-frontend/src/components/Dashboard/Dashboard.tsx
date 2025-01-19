import React from "react";
import styles from "./Dashboard.module.css"; // Use CSS module for styling

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
    <div className={styles["dashboard-container"]} role="region" aria-live="polite">
      <h1 className={styles["dashboard-header"]}>Welcome to Your Dashboard</h1>

      {/* User Statistics Section */}
      <section className={styles["user-stats"]} aria-labelledby="user-stats-title">
        <h2 id="user-stats-title" className={styles["section-header"]}>User Statistics</h2>
        <ul className={styles["stats-list"]}>
          <li>Total Goals: {userStats.totalGoals}</li>
          <li>Completed Goals: {userStats.completedGoals}</li>
          <li>Collaborations: {userStats.collaborations}</li>
        </ul>
      </section>

      {/* Recent Activities Section */}
      <section
        className={styles["recent-activities"]}
        aria-labelledby="recent-activities-title"
      >
        <h2 id="recent-activities-title" className={styles["section-header"]}>Recent Activities</h2>
        <ul className={styles["activities-list"]}>
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <li key={index} className={styles["activity-item"]}>
                {activity}
              </li>
            ))
          ) : (
            <p>No recent activities found.</p>
          )}
        </ul>
      </section>

      {/* Action Button */}
      <div className={styles["action-container"]}>
        <button
          onClick={() => onAction("exampleAction")}
          className={styles["dashboard-button"]}
          aria-label="Perform example action"
        >
          Perform Action
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
