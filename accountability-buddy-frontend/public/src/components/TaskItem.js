import React from 'react';
import PropTypes from 'prop-types';
import './TaskItem.css'; // Import optional CSS for styling

const TaskItem = ({ task, onComplete, onDelete }) => {
  return (
    <div
      className={`task-item ${task.isCompleted ? 'completed' : ''}`}
      role="listitem"
      aria-live="polite"
    >
      <div className="task-details">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onComplete(task.id)}
          aria-label={`Mark ${task.title} as ${task.isCompleted ? 'incomplete' : 'complete'}`}
        />
        <span className="task-title">{task.title}</span>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.title}`}
        className="delete-button"
      >
        Delete
      </button>
    </div>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskItem;
