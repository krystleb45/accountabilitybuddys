import React, { useState, useEffect } from 'react';
import {
  getUserCollaborationGoals,
  updateCollaborationGoalProgress,
} from 'src/api/collaboration/collaborationGoalApi';
import {
  CollaborationGoal,
  CollaborationGoalListProps,
  CollaborationUser,
} from './Collaboration.types';
import styles from './CollaborationGoalList.module.css';

const CollaborationGoalList: React.FC<CollaborationGoalListProps> = ({
  goals: initialGoals = [],
  onGoalClick,
}) => {
  const [goals, setGoals] = useState<CollaborationGoal[]>(initialGoals);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    // If initial goals are provided, stop loading
    if (initialGoals.length > 0) {
      setGoals(initialGoals);
      setLoading(false);
      return;
    }

    const fetchGoals = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response = await getUserCollaborationGoals(page);

        const formattedGoals: CollaborationGoal[] = response.goals.map(
          (goal: {
            id: string;
            title: string;
            description: string;
            assignedUsers: CollaborationUser[];
            dueDate: Date;
            status: string;
            progress?: number;
          }) => ({
            ...goal,
            progress: goal.progress ?? 0, // Ensure progress is always a number
            status: ['pending', 'in-progress', 'completed'].includes(
              goal.status
            )
              ? (goal.status as 'pending' | 'in-progress' | 'completed')
              : 'pending', // Default to 'pending' if status is invalid
          })
        );

        setGoals(formattedGoals);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error('Error fetching collaboration goals:', err);
        setError('Failed to fetch collaboration goals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [page, initialGoals]);

  const handleProgressUpdate = async (
    goalId: string,
    newProgress: number
  ): Promise<void> => {
    try {
      await updateCollaborationGoalProgress(goalId, newProgress);

      // Update the progress of the specific goal in the list
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === goalId ? { ...goal, progress: newProgress } : goal
        )
      );
    } catch (err) {
      console.error('Error updating goal progress:', err);
      alert('Failed to update goal progress. Please try again.');
    }
  };

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  return (
    <div className={styles['goal-list-container']}>
      <h2>Collaboration Goals</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : goals.length === 0 ? (
        <p>No goals to display</p>
      ) : (
        <ul className={styles['goal-list']}>
          {goals.map((goal) => (
            <li
              key={goal.id}
              className={styles['goal-card']}
              onClick={() => onGoalClick?.(goal.id)}
            >
              <h3 className={styles['goal-title']}>{goal.title}</h3>
              <p className={styles['goal-description']}>
                Progress: {goal.progress}%
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent click event
                  handleProgressUpdate(goal.id, goal.progress + 10);
                }}
                className={styles['progress-button']}
              >
                Update Progress
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Pagination */}
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            disabled={page === index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={
              page === index + 1
                ? styles['pagination-button-active']
                : styles['pagination-button']
            }
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CollaborationGoalList;
