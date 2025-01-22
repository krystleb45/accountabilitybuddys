import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reminder.css'; // Optional: Custom CSS for styling

interface Reminder {
  id: string;
  message: string;
  time: string;
}

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState<{
    message: string;
    time: string;
  }>({
    message: '',
    time: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fetch reminders when component mounts
  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/reminders`
        );
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReminder({ ...newReminder, [name]: value });
  };

  // Handle saving a new reminder
  const handleSaveReminder = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/reminders`,
        newReminder
      );
      setReminders([...reminders, response.data]);
      setNewReminder({ message: '', time: '' });
    } catch (err) {
      setError('Failed to save reminder. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle deleting a reminder
  const handleDeleteReminder = async (id: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/reminders/${id}`);
      setReminders((prevReminders) =>
        prevReminders.filter((reminder) => reminder.id !== id)
      );
    } catch (err) {
      setError('Failed to delete reminder. Please try again.');
    }
  };

  return (
    <div className="reminders">
      <h2>Reminders</h2>
      {loading ? (
        <p>Loading reminders...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul>
          {reminders.map((reminder) => (
            <li key={reminder.id}>
              <p>{reminder.message}</p>
              <p>{new Date(reminder.time).toLocaleString()}</p>
              <button onClick={() => handleDeleteReminder(reminder.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="new-reminder-form">
        <input
          type="text"
          name="message"
          placeholder="Reminder message"
          value={newReminder.message}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="time"
          value={newReminder.time}
          onChange={handleInputChange}
        />
        <button onClick={handleSaveReminder} disabled={saving}>
          {saving ? 'Saving...' : 'Save Reminder'}
        </button>
      </div>
    </div>
  );
};

export default Reminders;
