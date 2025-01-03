import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import "./Reminder.css"; // Adjust if using CSS modules: import styles from "./Reminder.module.css";

interface ReminderType {
  id: string;
  message: string;
  time: string;
}

const Reminder: React.FC = () => {
  const [reminders, setReminders] = useState<ReminderType[]>([]);
  const [newReminder, setNewReminder] = useState<{ message: string; time: string }>({
    message: "",
    time: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch reminders when the component mounts
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reminders`);
        if (Array.isArray(response.data)) {
          setReminders(response.data);
        } else {
          setError("Invalid response format. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching reminders:", err);
        setError("Failed to fetch reminders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  // Handle input changes for new reminders
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReminder((prev) => ({ ...prev, [name]: value }));
  };

  // Handle creating a new reminder
  const handleCreateReminder = async () => {
    if (!newReminder.message.trim() || !newReminder.time) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/reminders`, newReminder);
      setReminders((prev) => [...prev, response.data]);
      setNewReminder({ message: "", time: "" });
    } catch (err) {
      console.error("Error saving reminder:", err);
      setError("Failed to save the reminder. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading reminders...</p>;
  if (error) return <p className="error-message" role="alert">{error}</p>;

  return (
    <div className="reminder-container" role="region" aria-labelledby="reminder-header">
      <h2 id="reminder-header">Reminders</h2>
      <div className="new-reminder">
        <label htmlFor="message" className="visually-hidden">Reminder Message</label>
        <input
          type="text"
          id="message"
          name="message"
          value={newReminder.message}
          onChange={handleInputChange}
          placeholder="Reminder message"
          aria-label="Reminder message"
        />
        <label htmlFor="time" className="visually-hidden">Reminder Time</label>
        <input
          type="time"
          id="time"
          name="time"
          value={newReminder.time}
          onChange={handleInputChange}
          placeholder="Reminder time"
          aria-label="Reminder time"
        />
        <button onClick={handleCreateReminder} disabled={saving} aria-busy={saving}>
          {saving ? "Saving..." : "Add Reminder"}
        </button>
      </div>
      <ul className="reminder-list">
        {reminders.map((reminder) => (
          <li key={reminder.id} className="reminder-item">
            <p>{reminder.message}</p>
            <span>{reminder.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reminder;
