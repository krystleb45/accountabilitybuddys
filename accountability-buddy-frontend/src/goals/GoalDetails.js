import React from "react";
import PropTypes from "prop-types";
import "./GoalDetails.css"; // Optional CSS for styling

const GoalDetails = ({ goal, onEdit, onDelete }) => {
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

GoalDetails.propTypes = {
  goal: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    progress: PropTypes.number,
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

GoalDetails.defaultProps = {
  goal: null,
};

export default GoalDetails;
