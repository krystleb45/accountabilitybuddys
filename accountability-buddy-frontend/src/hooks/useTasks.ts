import { useState, useCallback } from "react";
import { Task, TaskFilters } from "src/components/Tasks/types";

/**
 * Custom hook to manage tasks with filtering and CRUD operations.
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [error, setError] = useState<string | null>(null);

  // Add a new task
  const addTask = useCallback((newTask: Omit<Task, "id">) => {
    try {
      const task: Task = {
        id: Date.now().toString(),
        ...newTask,
      };
      setTasks((prevTasks) => [...prevTasks, task]);
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task.");
    }
  }, []);

  // Update an existing task
  const updateTask = useCallback((updatedTask: Task) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task.");
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback((taskId: string) => {
    try {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task.");
    }
  }, []);

  // Toggle task completion
  const toggleTaskCompletion = useCallback((taskId: string) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        )
      );
    } catch (err) {
      console.error("Error toggling task completion:", err);
      setError("Failed to toggle task completion.");
    }
  }, []);

  // Apply filters to tasks
  const applyFilters = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters);
  }, []);

  // Get filtered tasks
  const filteredTasks = tasks.filter((task) => {
    if (filters.status && filters.status !== (task.isCompleted ? "completed" : "pending")) {
      return false;
    }
    if (filters.priority && filters.priority !== task.priority) {
      return false;
    }
    if (
      filters.searchTerm &&
      !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tasks,
    filteredTasks,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    applyFilters,
    clearError,
  };
};
