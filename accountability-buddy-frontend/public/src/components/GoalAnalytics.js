import React, { useState, useEffect } from 'react';
import { getGoalAnalytics } from '../services/api';
import { Line, Bar } from 'react-chartjs-2';
import LoadingSpinner from './LoadingSpinner';
import './GoalAnalytics.css'; // Optional CSS for styling

const GoalAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getGoalAnalytics({ dateRange });
        setAnalytics(response.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  // Data for charts
  const goalsChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Goals Overview',
        data: analytics ? [analytics.completedGoals, analytics.pendingGoals] : [],
        backgroundColor: ['#28a745', '#dc3545'],
      },
    ],
  };

  const milestonesChartData = {
    labels: ['Completed Milestones', 'Total Milestones'],
    datasets: [
      {
        label: 'Milestone Progress',
        data: analytics ? [analytics.completedMilestones, analytics.totalMilestones] : [],
        backgroundColor: ['#007bff', '#ffc107'],
      },
    ],
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="goal-analytics-container" role="region" aria-live="polite">
      <h2>Goal Analytics</h2>

      {/* Date Range Filter */}
      <div className="filter-container">
        <label htmlFor="dateRange">Filter by Date Range:</label>
        <select
          id="dateRange"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          aria-label="Select date range for goal analytics"
        >
          <option value="all">All Time</option>
          <option value="lastMonth">Last Month</option>
          <option value="last3Months">Last 3 Months</option>
          <option value="last6Months">Last 6 Months</option>
          <option value="lastYear">Last Year</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <p className="error-message" role="alert" aria-live="assertive">
          {error}
        </p>
      )}

      {/* Display charts if analytics data exists */}
      {analytics && (
        <div className="charts-container">
          <div className="chart-item" aria-label="Goals Overview Chart">
            <h3>Goals Overview</h3>
            <Bar data={goalsChartData} aria-label="Bar chart showing completed and pending goals" />
          </div>

          <div className="chart-item" aria-label="Milestone Progress Chart">
            <h3>Milestone Progress</h3>
            <Bar data={milestonesChartData} aria-label="Bar chart showing completed and total milestones" />
          </div>

          <div className="chart-item" aria-label="Milestones Over Time Chart">
            <h3>Milestones Over Time</h3>
            <Line
              data={{
                labels: analytics.milestoneTimeline.labels,
                datasets: [
                  {
                    label: 'Milestones Completed Over Time',
                    data: analytics.milestoneTimeline.data,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    fill: true,
                  },
                ],
              }}
              aria-label="Line chart showing milestone completion over time"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalAnalytics;
