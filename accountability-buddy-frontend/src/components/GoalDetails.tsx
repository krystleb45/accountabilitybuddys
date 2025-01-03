import React from "react";
import "./GoalDetails.css"; // Optional CSS for styling

interface Goal {
  id: string;
  title: string;
  description?: string;
  status: string;
  progress: number;
}

interface GoalDetailsProps {
  goal: Goal | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const GoalDetails: React.FC<GoalDetailsProps> = ({ goal, onEdit, onDelete }) => {
  if (!goal) {
    return <p>No goal details available.</p>;
  }

  return (
    <div className="goal-details" role="region" aria-live="polite">
      <h2>{goal.title}</h2>
      <p>{goal.description}</p>
      <p>Status: {goal.status}</p>
      <p>Progress: {goal.progress}%</p>

      <div className="goal-actions">
        <button
          onClick={() => onEdit(goal.id)}
          aria-label={`Edit ${goal.title}`}
        >
          Edit Goal
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          aria-label={`Delete ${goal.title}`}
        >
          Delete Goal
        </button>
      </div>
    </div>
  );
};

export default GoalDetails;
