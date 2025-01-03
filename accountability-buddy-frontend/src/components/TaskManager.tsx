import React, { useState } from "react";
import TaskList from "./TaskList";
import "./TaskManager.css"; // Optional CSS for styling

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");

  const addTask = () => {
    if (!newTask.trim()) return;

    const newTaskObject: Task = {
      id: Date.now().toString(),
      title: newTask,
      isCompleted: false,
    };

    setTasks([...tasks, newTaskObject]);
    setNewTask("");
  };

  const completeTask = (id: string) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="task-manager">
      <h2>Task Manager</h2>
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          aria-label="New task input"
        />
        <button onClick={addTask} aria-label="Add task">
          Add Task
        </button>
      </div>
      <TaskList tasks={tasks} onComplete={completeTask} onDelete={deleteTask} />
    </div>
  );
};

export default TaskManager;
