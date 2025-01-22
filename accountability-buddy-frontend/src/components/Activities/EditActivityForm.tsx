import React, { useState, useEffect } from 'react';
import './EditActivityForm.css'; // Optional CSS for styling

interface Activity {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface EditActivityFormProps {
  activity: Activity; // Activity to edit
  onSubmit: (updatedActivity: Activity) => void; // Callback for form submission
  onCancel?: () => void; // Optional callback for cancel action
}

const EditActivityForm: React.FC<EditActivityFormProps> = ({
  activity,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState<string>(activity.title);
  const [description, setDescription] = useState<string>(activity.description);
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>(
    activity.status
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTitle(activity.title);
    setDescription(activity.description);
    setStatus(activity.status);
  }, [activity]);

  const handleSubmit = (e: React.FormEvent) => {
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
    onSubmit({
      ...activity,
      title: title.trim(),
      description: description.trim(),
      status,
    });
  };

  return (
    <form className="edit-activity-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Edit Activity</h2>
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
          onChange={(e) =>
            setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')
          }
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="form-submit-button">
          Save Changes
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

export default EditActivityForm;
