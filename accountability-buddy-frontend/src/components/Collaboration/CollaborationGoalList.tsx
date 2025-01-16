import React, { useState, useEffect } from "react";
import {
  getUserCollaborationGoals,
  updateCollaborationGoalProgress,
} from "../api/collaboration/collaborationGoalApi";
import "./CollaborationGoalList.css";

interface Goal {
  id: string;
  title: string;
  progress: number;
  // Add any additional fields based on your goal structure
}

const CollaborationGoalList: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUserCollaborationGoals(page);
        setGoals(data.goals);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError("Failed to fetch collaboration goals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [page]);

  const handleProgressUpdate = async (goalId: string, newProgress: number) => {
    try {
      await updateCollaborationGoalProgress(goalId, newProgress);
      // Refresh the goals after updating progress
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, progress: newProgress } : goal
        )
      );
    } catch (error) {
      console.error("Failed to update goal progress:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="collaboration-goal-list">
      <h2>Collaboration Goals</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul>
          {goals.map((goal) => (
            <li key={goal.id}>
              <h3>{goal.title}</h3>
              <p>Progress: {goal.progress}%</p>
              <button
                onClick={() => handleProgressUpdate(goal.id, goal.progress + 10)}
              >
                Update Progress
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            disabled={page === index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CollaborationGoalList;
