import React from "react";

// Placeholder for a chart component
const Chart: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="h-48 bg-gray-200 flex items-center justify-center rounded-lg">
      <p className="text-gray-500">Chart will be displayed here</p>
    </div>
  </div>
);

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-100 to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Overview</h1>
        <nav className="flex gap-4">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </a>
          <a href="/settings" className="text-blue-600 hover:underline">
            Settings
          </a>
        </nav>
      </header>

      {/* Filters Section */}
      <section className="mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4">
          <label className="text-gray-700" htmlFor="date-range">
            Date Range:
          </label>
          <select
            id="date-range"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Apply
          </button>
        </div>
      </section>

      {/* Analytics Charts Section */}
      <main>
        <Chart title="User Growth" />
        <Chart title="Task Completion Rate" />
        <Chart title="Engagement Trends" />
        <Chart title="Goal Achievement Rates" />
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights
        reserved.
      </footer>
    </div>
  );
};

export default AnalyticsPage;
