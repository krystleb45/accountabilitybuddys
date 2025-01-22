import React, { useState, useEffect } from 'react';
import './Tasks.module.css';

interface TaskFormProps {
  onSubmit: (task: {
    id?: string;
    name: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
  }) => void;
  initialValues?: {
    id?: string;
    name: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
  };
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialValues,
  onCancel,
}) => {
  const [name, setName] = useState<string>(initialValues?.name || '');
  const [description, setDescription] = useState<string>(
    initialValues?.description || ''
  );
  const [dueDate, setDueDate] = useState<string>(initialValues?.dueDate || '');
  const [priority, setPriority] = useState<string>(
    initialValues?.priority || 'medium'
  );
  const [status, setStatus] = useState<string>(
    initialValues?.status || 'pending'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialValues?.id,
      name,
      description,
      dueDate,
      priority,
      status,
    });
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setStatus('pending');
  };

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setDescription(initialValues.description);
      setDueDate(initialValues.dueDate);
      setPriority(initialValues.priority);
      setStatus(initialValues.status);
    }
  }, [initialValues]);

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>{initialValues ? 'Edit Task' : 'Create Task'}</h3>

      <div className="form-group">
        <label htmlFor="task-name">Task Name:</label>
        <input
          type="text"
          id="task-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="due-date">Due Date:</label>
        <input
          type="date"
          id="due-date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          {initialValues ? 'Update Task' : 'Create Task'}
        </button>
        {onCancel && (
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
