import React from "react";
import "./TaskItem.css"; // Import optional CSS for styling

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete }) => {
  return (
    <div
      className={`task-item ${task.isCompleted ? "completed" : ""}`}
      role="listitem"
      aria-live="polite"
    >
      <div className="task-details">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={() => onComplete(task.id)}
          aria-label={`Mark ${task.title} as ${
            task.isCompleted ? "incomplete" : "complete"
          }`}
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

export default TaskItem;
