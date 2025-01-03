import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AnalyticsPage.css"; // Import CSS for styling

// Define a type for the analytics data
interface AnalyticsData {
  totalUsers: number;
  goalsCompleted: number;
  activeUsers: number;
}

const AnalyticsPage: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch analytics data from the API
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get<AnalyticsData>(
          `${process.env.REACT_APP_API_URL}/analytics`
        );
        setAnalyticsData(response.data);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="error-message" role="alert">{error}</p>;

  return (
    <div className="analytics-page" role="region" aria-labelledby="analytics-header">
      <h1 id="analytics-header">Analytics</h1>
      {analyticsData ? (
        <div className="analytics-content">
          {/* Example analytics data display */}
          <div className="analytics-card">
            <h2>Total Users</h2>
            <p>{analyticsData.totalUsers}</p>
          </div>
          <div className="analytics-card">
            <h2>Goals Completed</h2>
            <p>{analyticsData.goalsCompleted}</p>
          </div>
          <div className="analytics-card">
            <h2>Active Users</h2>
            <p>{analyticsData.activeUsers}</p>
          </div>
          {/* Add more analytics data as needed */}
        </div>
      ) : (
        <p>No analytics data available.</p>
      )}
    </div>
  );
};

export default AnalyticsPage;
