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
      title: newTask.trim(),
      isCompleted: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTaskObject]);
    setNewTask("");
  };

  const completeTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.isCompleted));
  };

  return (
    <div className="task-manager">
      <h2 className="task-manager-title">Task Manager</h2>
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          aria-label="New task input"
        />
        <button onClick={addTask} aria-label="Add task" disabled={!newTask.trim()}>
          Add Task
        </button>
      </div>
      <TaskList tasks={tasks} onComplete={completeTask} onDelete={deleteTask} />
      {tasks.some((task) => task.isCompleted) && (
        <button
          className="clear-completed-button"
          onClick={clearCompletedTasks}
          aria-label="Clear completed tasks"
        >
          Clear Completed Tasks
        </button>
      )}
    </div>
  );
};

export default TaskManager;
