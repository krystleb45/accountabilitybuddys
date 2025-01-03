import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reminder.css'; // Optional: Custom CSS for styling

const Reminder = () => {
  const [reminders, setReminders] = useState([]);  // Store fetched reminders
  const [newReminder, setNewReminder] = useState({ message: '', time: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch reminders when component mounts
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reminders`);
        setReminders(response.data);
      } catch (err) {
        setError('Failed to fetch reminders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  // Handle input changes for new reminders
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReminder((prev) => ({ ...prev, [name]: value }));
  };

  // Validate input (basic validation for date format and message)
  const validateInput = () => {
    if (!newReminder.message || !newReminder.time) {
      setError('Please provide both a reminder message and time.');
      return false;
    }
    const currentTime = new Date().getTime();
    const reminderTime = new Date(newReminder.time).getTime();
    if (reminderTime < currentTime) {
      setError('Please select a future date and time for the reminder.');
      return false;
    }
    return true;
  };

  // Submit new reminder
  const handleCreateReminder = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!validateInput()) {
      setSaving(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/reminders/create`, newReminder);
      setReminders([...reminders, response.data]); // Add new reminder to the list
      setNewReminder({ message: '', time: '' }); // Reset form
    } catch (err) {
      setError('Failed to create reminder. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle reminder enabled/disabled state
  const toggleReminderStatus = async (id, isActive) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/reminders/${isActive ? 'disable' : 'enable'}/${id}`);
      setReminders((prevReminders) =>
        prevReminders.map((reminder) =>
          reminder._id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
        )
      );
    } catch (err) {
      setError('Failed to update reminder status. Please try again.');
    }
  };

  // Delete reminder
  const handleDeleteReminder = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/reminders/${id}`);
      setReminders(reminders.filter((reminder) => reminder._id !== id));
    } catch (err) {
      setError('Failed to delete reminder. Please try again.');
    }
  };

  // Loading state
  if (loading) return <p>Loading reminders...</p>;

  return (
    <div className="reminder-container">
      <h2>Reminders</h2>
      {error && <p style={{ color: 'red' }} role="alert" aria-live="assertive">{error}</p>}

      <form onSubmit={handleCreateReminder} className="reminder-form">
        <div>
          <label htmlFor="message">Reminder Message:</label>
          <input
            type="text"
            id="message"
            name="message"
            value={newReminder.message}
            onChange={handleInputChange}
            required
            aria-label="Reminder Message"
          />
        </div>
        <div>
          <label htmlFor="time">Reminder Time:</label>
          <input
            type="datetime-local"
            id="time"
            name="time"
            value={newReminder.time}
            onChange={handleInputChange}
            required
            aria-label="Reminder Time"
          />
        </div>
        <button type="submit" disabled={saving} aria-busy={saving}>
          {saving ? 'Saving...' : 'Create Reminder'}
        </button>
      </form>

      <h3>Your Reminders</h3>
      {reminders.length === 0 ? (
        <p>No reminders set yet.</p>
      ) : (
        <ul className="reminder-list">
          {reminders.map((reminder) => (
            <li key={reminder._id} className={reminder.isActive ? 'active' : 'disabled'}>
              <div>
                <p>{reminder.message}</p>
                <p>{new Date(reminder.time).toLocaleString()}</p>
              </div>
              <div className="reminder-actions">
                <button onClick={() => toggleReminderStatus(reminder._id, reminder.isActive)}>
                  {reminder.isActive ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => handleDeleteReminder(reminder._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reminder;
