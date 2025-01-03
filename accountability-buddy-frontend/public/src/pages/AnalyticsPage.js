import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './AnalyticsPage.css'; // Custom styles

const AnalyticsPage = () => {
  const [userGrowthData, setUserGrowthData] = useState({});
  const [engagementData, setEngagementData] = useState({});
  const [activeUsersData, setActiveUsersData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('monthly'); // Default filter

  // Fetch analytics data based on the selected filter
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/analytics?filter=${filter}`);
        const { userGrowth, engagement, activeUsers } = response.data;
        
        // Set data for charts
        setUserGrowthData(formatChartData(userGrowth, 'User Growth'));
        setEngagementData(formatChartData(engagement, 'Engagement Rate'));
        setActiveUsersData(formatChartData(activeUsers, 'Active Users'));
      } catch (err) {
        console.error('Failed to fetch analytics data:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [filter]);

  // Format data for Chart.js
  const formatChartData = (data, label) => ({
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: label,
        data: data.map((item) => item.value),
        fill: false,
        borderColor: '#007bff',
        tension: 0.1,
      },
    ],
  });

  return (
    <div className="analytics-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Analytics Dashboard</h1>

      {/* Filter Controls */}
      <div className="filter-controls" style={{ marginBottom: '20px' }}>
        <label htmlFor="filter">Filter by:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {loading && <p>Loading analytics data...</p>}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* User Growth Chart */}
          <section className="chart-section" style={{ marginBottom: '40px' }}>
            <h2>User Growth</h2>
            <Line data={userGrowthData} options={{ responsive: true, maintainAspectRatio: false }} />
          </section>

          {/* Engagement Rate Chart */}
          <section className="chart-section" style={{ marginBottom: '40px' }}>
            <h2>Engagement Rate</h2>
            <Bar data={engagementData} options={{ responsive: true, maintainAspectRatio: false }} />
          </section>

          {/* Active Users Chart */}
          <section className="chart-section" style={{ marginBottom: '40px' }}>
            <h2>Active Users</h2>
            <Pie data={activeUsersData} options={{ responsive: true, maintainAspectRatio: false }} />
          </section>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
