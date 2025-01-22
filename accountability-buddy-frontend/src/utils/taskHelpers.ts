import { Task, TaskFilters } from 'src/components/Tasks/types';

/**
 * Filters tasks based on the provided filters.
 *
 * @param tasks - The array of tasks to filter.
 * @param filters - The filters to apply.
 * @returns A filtered array of tasks.
 */
export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  if (!Array.isArray(tasks)) {
    throw new Error('The tasks parameter must be an array.');
  }

  return tasks.filter((task) => {
    if (
      filters.status &&
      filters.status !== (task.isCompleted ? 'completed' : 'pending')
    ) {
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
};

/**
 * Sorts tasks by due date or priority.
 *
 * @param tasks - The array of tasks to sort.
 * @param sortBy - The property to sort by ("dueDate" or "priority").
 * @returns A sorted array of tasks.
 */
export const sortTasks = (
  tasks: Task[],
  sortBy: 'dueDate' | 'priority'
): Task[] => {
  if (!Array.isArray(tasks)) {
    throw new Error('The tasks parameter must be an array.');
  }

  return [...tasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const dateA = new Date(a.dueDate || '').getTime();
      const dateB = new Date(b.dueDate || '').getTime();
      return dateA - dateB;
    }

    if (sortBy === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      const priorityA = priorityOrder[a.priority || 'low'] || 0;
      const priorityB = priorityOrder[b.priority || 'low'] || 0;
      return priorityA - priorityB;
    }

    return 0;
  });
};

/**
 * Formats a task's due date into a readable string.
 *
 * @param dueDate - The ISO string of the due date.
 * @returns A formatted date string or "No due date" if not provided.
 */
export const formatDueDate = (dueDate?: string): string => {
  if (!dueDate) return 'No due date';

  const parsedDate = new Date(dueDate);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid due date format.');
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return parsedDate.toLocaleDateString(undefined, options);
};

/**
 * Generates a summary of completed and pending tasks.
 *
 * @param tasks - The array of tasks.
 * @returns A summary object containing counts for completed and pending tasks.
 */
export const getTaskSummary = (
  tasks: Task[]
): { completed: number; pending: number } => {
  if (!Array.isArray(tasks)) {
    throw new Error('The tasks parameter must be an array.');
  }

  const completed = tasks.filter((task) => task.isCompleted).length;
  const pending = tasks.filter((task) => !task.isCompleted).length;
  return { completed, pending };
};

/**
 * Counts the number of tasks with a specific priority.
 *
 * @param tasks - The array of tasks.
 * @param priority - The priority to count ("low", "medium", "high").
 * @returns The count of tasks with the specified priority.
 */
export const countTasksByPriority = (
  tasks: Task[],
  priority: 'low' | 'medium' | 'high'
): number => {
  if (!Array.isArray(tasks)) {
    throw new Error('The tasks parameter must be an array.');
  }

  return tasks.filter((task) => task.priority === priority).length;
};

export default {
  filterTasks,
  sortTasks,
  formatDueDate,
  getTaskSummary,
  countTasksByPriority,
};
