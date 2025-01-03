import React, { useState, useEffect } from 'react';
import {
  getUserCollaborationGoals,
  updateCollaborationGoalProgress,
} from '../api/collaborationGoal';
import './CollaborationGoalList.css'; // Import custom CSS for styling

const CollaborationGoalList = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for API requests
  const [error, setError] = useState(null); // Error state for API failures
  const [page, setPage] = useState(1); // Pagination state
  const [totalPages, setTotalPages] = useState(1); // To handle total number of pages

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserCollaborationGoals(page);
        setGoals(data.goals);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('Failed to fetch collaboration goals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [page]);

  const handleProgressUpdate = async (goalId, progress) => {
    try {
      await updateCollaborationGoalProgress(goalId, progress);
      const updatedGoals = goals.map((goal) =>
        goal._id === goalId ? { ...goal, progress } : goal
      );
      setGoals(updatedGoals);
    } catch (err) {
      setError('Failed to update goal progress. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return <p aria-live="polite">Loading collaboration goals...</p>;
  }

  if (error) {
    return (
      <p className="error-message" role="alert" aria-live="assertive">
        {error}
      </p>
    );
  }

  return (
    <div className="collaboration-goal-list">
      <h2>Your Collaboration Goals</h2>
      <ul aria-live="polite">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <li key={goal._id} className="goal-item">
              <h3>{goal.goalTitle}</h3>
              <p>{goal.description}</p>
              <p>Status: {goal.status}</p>
              <div className="progress-container">
                <label htmlFor={`progress-${goal._id}`}>
                  Progress: {goal.progress}%
                </label>
                <input
                  id={`progress-${goal._id}`}
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) =>
                    handleProgressUpdate(goal._id, e.target.value)
                  }
                  disabled={goal.status === 'completed'}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={goal.progress}
                  aria-label={`Progress for ${goal.goalTitle}`}
                />
              </div>
            </li>
          ))
        ) : (
          <p>No collaboration goals available. Start by creating one!</p>
        )}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination-controls" role="navigation" aria-label="Pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span aria-live="polite">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CollaborationGoalList;
