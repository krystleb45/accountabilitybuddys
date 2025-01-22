import React, { useState } from 'react';
import './Tasks.module.css';

interface TaskFiltersProps {
  onFilterChange: (filters: {
    status?: string;
    priority?: string;
    searchTerm?: string;
  }) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleFilterChange = () => {
    onFilterChange({
      status: status || undefined,
      priority: priority || undefined,
      searchTerm: searchTerm || undefined,
    });
  };

  const resetFilters = () => {
    setStatus('');
    setPriority('');
    setSearchTerm('');
    onFilterChange({});
  };

  return (
    <div className="task-filters">
      <h3>Filter Tasks</h3>
      <div className="filter-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="searchTerm">Search:</label>
        <input
          type="text"
          id="searchTerm"
          value={searchTerm}
          placeholder="Search by task name..."
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleFilterChange();
          }}
        />
      </div>

      <button className="reset-button" onClick={resetFilters}>
        Reset Filters
      </button>
    </div>
  );
};

export default TaskFilters;
