import React from "react";
import "./GoalDetails.module.css"; // Use CSS Modules for scoped styling

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
    return <p className="no-goal-message" role="alert">No goal details available.</p>;
  }

  return (
    <div className="goal-details" role="region" aria-live="polite" aria-labelledby="goal-details-header">
      <h2 id="goal-details-header" className="goal-title">{goal.title}</h2>
      <p className="goal-description">{goal.description || "No description provided."}</p>
      <p className="goal-status">Status: <strong>{goal.status}</strong></p>
      <p className="goal-progress">Progress: <strong>{goal.progress}%</strong></p>

      <div className="goal-actions">
        <button
          onClick={() => onEdit(goal.id)}
          className="edit-button"
          aria-label={`Edit ${goal.title}`}
        >
          Edit Goal
        </button>
        <button
          onClick={() => onDelete(goal.id)}
          className="delete-button"
          aria-label={`Delete ${goal.title}`}
        >
          Delete Goal
        </button>
      </div>
    </div>
  );
};

export default GoalDetails;
