// Represents a single task
export interface Task {
  id: string; // Unique identifier for the task
  title: string; // Title of the task
  description?: string; // Optional description of the task
  dueDate?: string; // Optional due date (ISO 8601 string format)
  priority?: 'low' | 'medium' | 'high'; // Optional priority level
  isCompleted: boolean; // Task completion status
}

// Props for the TaskItem component
export interface TaskItemProps {
  task: Task; // Task object
  onComplete: (taskId: string) => void; // Callback to handle task completion toggle
  onDelete: (taskId: string) => void; // Callback to handle task deletion
}

// Props for the TaskList component
export interface TaskListProps {
  tasks: Task[]; // Array of task objects
  onComplete: (taskId: string) => void; // Callback to handle task completion toggle
  onDelete: (taskId: string) => void; // Callback to handle task deletion
}

// Props for the TaskForm component
export interface TaskFormProps {
  onSubmit: (task: Task) => void; // Callback to handle task creation or editing
  initialValues?: Task; // Optional initial values for editing an existing task
  onCancel?: () => void; // Optional callback to handle form cancellation
}

// Props for the TaskFilters component
export interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilters) => void; // Callback to handle filter changes
}

// Represents the filters used to filter tasks
export interface TaskFilters {
  status?: 'completed' | 'pending' | 'in_progress'; // Optional filter by task status
  priority?: 'low' | 'medium' | 'high'; // Optional filter by priority
  searchTerm?: string; // Optional search term to filter tasks by title or description
}

// Represents the state for the TaskManager component
export interface TaskManagerState {
  tasks: Task[]; // Array of task objects
  filters: TaskFilters; // Current filters applied to the task list
  newTaskInput: string; // Current value of the "new task" input field
}
