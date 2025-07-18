import React from 'react';
import TaskItem from './TaskItem'; // Assuming TaskItem.tsx exists
import './TaskList.css'; // Optional CSS for styling

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete, onDelete }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="task-list-empty" role="alert">
        No tasks available. Start by creating one!
      </p>
    );
  }

  return (
    <div className="task-list-container">
      <h3 className="task-list-title">Your Tasks</h3>
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
    </div>
  );
};

export default TaskList;
