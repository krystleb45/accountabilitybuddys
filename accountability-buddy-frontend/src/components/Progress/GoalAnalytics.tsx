import React, { useState, useEffect } from 'react';
import { getGoalAnalytics } from 'src/services/goalService';
import { Line } from 'react-chartjs-2';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './GoalAnalytics.module.css';

interface AnalyticsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

const GoalAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('all');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await getGoalAnalytics({ dateRange });

        // Check if response and response.data exist before accessing them
        if (response && response.data) {
          setAnalytics(response.data);
        } else {
          throw new Error('Invalid analytics data received.');
        }
      } catch (err: unknown) {
        console.error('Error fetching analytics:', err);
        setError(
          err?.message || 'Failed to load analytics data. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  // Default data for charts
  const goalsChartData = analytics || {
    labels: [],
    datasets: [
      {
        label: 'Goals Completed',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        fill: true,
      },
    ],
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  return (
    <div
      className="goal-analytics"
      role="region"
      aria-labelledby="analytics-header"
    >
      <h2 id="analytics-header">Goal Analytics</h2>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : (
        <>
          <div className="date-range-selector">
            <label htmlFor="dateRange">Date Range:</label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={handleDateRangeChange}
              aria-label="Select date range for analytics"
            >
              <option value="all">All Time</option>
              <option value="lastMonth">Last Month</option>
              <option value="lastWeek">Last Week</option>
            </select>
          </div>
          <div className="chart-container">
            <Line
              data={goalsChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GoalAnalytics;
