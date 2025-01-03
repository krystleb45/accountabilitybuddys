import React, { useState, useEffect } from "react";
import {
  getUserCollaborationGoals,
  updateCollaborationGoalProgress,
} from "../src/api/collaborationGoalApi";
import "./CollaborationGoalList.css";

// Define types for goals and API response
interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
}

interface GoalsResponse {
  goals: Goal[];
  totalPages: number;
}

const CollaborationGoalList: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch goals when the component mounts or page changes
  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      setError(null);

      try {
        const data: GoalsResponse = await getUserCollaborationGoals(page);
        setGoals(data.goals);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to fetch collaboration goals:", err);
        setError("Failed to fetch collaboration goals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [page]);

  // Handle updating goal progress
  const handleUpdateProgress = async (goalId: string, progress: number) => {
    try {
      await updateCollaborationGoalProgress(goalId, progress);
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, progress } : goal
        )
      );
    } catch (err) {
      console.error("Failed to update goal progress:", err);
      setError("Failed to update goal progress. Please try again later.");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div
      className="collaboration-goal-list"
      role="region"
      aria-labelledby="collaboration-goal-header"
    >
      <h2 id="collaboration-goal-header">Collaboration Goals</h2>
      {loading ? (
        <p>Loading collaboration goals...</p>
      ) : error ? (
        <p className="error-message" role="alert">
          {error}
        </p>
      ) : (
        <ul>
          {goals.map((goal) => (
            <li key={goal.id}>
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
              <p>Progress: {goal.progress}%</p>
              <button
                onClick={() => handleUpdateProgress(goal.id, Math.min(goal.progress + 10, 100))}
                aria-label={`Increase progress for ${goal.title}`}
              >
                Update Progress
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span>
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
