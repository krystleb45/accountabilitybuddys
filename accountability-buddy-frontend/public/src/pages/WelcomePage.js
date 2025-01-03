import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css'; // Import custom styles

const WelcomePage = () => {
  return (
    <div className="welcome-page" style={{ padding: '20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to Accountability Buddy!</h1>
      <p style={{ margin: '20px 0', fontSize: '1.2rem' }}>
        We're excited to help you stay on track with your goals, build new habits, and achieve personal growth.
      </p>

      <div className="feature-overview" style={{ marginTop: '40px' }}>
        <h2>Our Key Features</h2>
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          <li style={{ margin: '20px 0', fontSize: '1.1rem' }}>
            ✅ <strong>Goal Tracking:</strong> Set, manage, and achieve your personal and professional goals.
          </li>
          <li style={{ margin: '20px 0', fontSize: '1.1rem' }}>
            📈 <strong>Progress Insights:</strong> Visualize your progress through detailed analytics and reports.
          </li>
          <li style={{ margin: '20px 0', fontSize: '1.1rem' }}>
            🤝 <strong>Community Support:</strong> Join groups and interact with like-minded people for mutual accountability.
          </li>
          <li style={{ margin: '20px 0', fontSize: '1.1rem' }}>
            🔔 <strong>Reminders & Notifications:</strong> Stay on top of your tasks with custom reminders and alerts.
          </li>
        </ul>
      </div>

      <div className="onboarding-buttons" style={{ marginTop: '40px' }}>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '15px 30px',
              margin: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: '#28a745',
              color: '#fff',
              borderRadius: '5px',
            }}
          >
            Get Started
          </button>
        </Link>

        <Link to="/login" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '15px 30px',
              margin: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: '#007bff',
              color: '#fff',
              borderRadius: '5px',
            }}
          >
            Log In
          </button>
        </Link>

        <Link to="/about" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '15px 30px',
              margin: '10px',
              fontSize: '1rem',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: '#ffc107',
              color: '#000',
              borderRadius: '5px',
            }}
          >
            Learn More
          </button>
        </Link>
      </div>

      <footer style={{ marginTop: '50px', fontSize: '0.9rem', color: '#666' }}>
        © 2024 Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default WelcomePage;
