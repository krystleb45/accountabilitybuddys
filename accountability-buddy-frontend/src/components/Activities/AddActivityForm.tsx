import React, { useState } from 'react';
import './AddActivityForm.css'; // Optional CSS for styling

interface AddActivityFormProps {
  onSubmit: (activity: {
    title: string;
    description: string;
    status: string;
  }) => void; // Callback for form submission
  onCancel?: () => void; // Optional callback for cancel action
}

const AddActivityForm: React.FC<AddActivityFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<string>('pending');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    // Form validation
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }

    setError(null);
    onSubmit({ title: title.trim(), description: description.trim(), status });
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

  return (
    <form className="add-activity-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Add New Activity</h2>
      {error && <p className="form-error">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter activity title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter activity description"
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="form-submit-button">
          Add Activity
        </button>
        {onCancel && (
          <button
            type="button"
            className="form-cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddActivityForm;
