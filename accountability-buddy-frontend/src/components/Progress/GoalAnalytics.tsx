import React, { useState, useEffect } from "react";
import { getGoalAnalytics } from "../services/goalService";
import { Line } from "react-chartjs-2";
import LoadingSpinner from "./LoadingSpinner";
import "./GoalAnalytics.css"; // Optional CSS for styling

interface AnalyticsData {
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor?: string }[];
}

const GoalAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("all");

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getGoalAnalytics({ dateRange });
        setAnalytics(response.data);
      } catch (err: any) {
        console.error("Error fetching analytics:", err);
        setError(err?.message || "Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  // Data for charts
  const goalsChartData = analytics || {
    labels: [],
    datasets: [
      {
        label: "Goals Completed",
        data: [],
      },
    ],
  };

  return (
    <div className="goal-analytics">
      <h2>Goal Analytics</h2>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="date-range-selector">
            <label htmlFor="dateRange">Date Range:</label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastWeek">Last Week</option>
            </select>
          </div>
          <div className="chart-container">
            <Line data={goalsChartData} />
          </div>
        </>
      )}
    </div>
  );
};

export default GoalAnalytics;
