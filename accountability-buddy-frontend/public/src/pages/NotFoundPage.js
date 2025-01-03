import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // State for countdown timer

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000); // Decrease countdown every second

    const redirectTimeout = setTimeout(() => {
      navigate('/');
    }, 5000); // Redirect after 5 seconds

    // Cleanup timers when component unmounts
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="not-found-page" style={{ textAlign: 'center', padding: '50px' }}>
      <h2
        style={{ fontSize: '2rem', color: '#ff4040' }}
        role="alert"
        aria-live="assertive"
      >
        404 - Page Not Found
      </h2>
      <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>
        The page you are looking for does not exist.
      </p>
      <p style={{ fontSize: '1rem', marginTop: '20px' }}>
        Redirecting to the homepage in {countdown} seconds...
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: 'pointer',
          border: 'none',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '5px',
        }}
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFoundPage;
