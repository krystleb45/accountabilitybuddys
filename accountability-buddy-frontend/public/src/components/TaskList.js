import React from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem'; // Assuming TaskItem.js exists
import './TaskList.css'; // Optional CSS for styling

const TaskList = ({ tasks, onComplete, onDelete }) => {
  if (!tasks || tasks.length === 0) {
    return <p>No tasks available. Start by creating one!</p>;
  }

  return (
    <div className="task-list" role="list" aria-live="polite">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      isCompleted: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onComplete: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskList;

