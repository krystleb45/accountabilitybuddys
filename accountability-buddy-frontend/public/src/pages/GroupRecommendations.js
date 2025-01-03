import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="spinner" style={{ textAlign: 'center', margin: '20px' }}>
    <div className="spinner-circle" style={{ width: '30px', height: '30px', border: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <p>Loading...</p>
  </div>
);

const GroupRecommendations = () => {
  const [recommendedGroups, setRecommendedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch group recommendations from the API
  const fetchRecommendations = async () => {
    setLoading(true);
    setError(''); // Clear previous error
    try {
      const res = await axios.get('https://accountabilitybuddys.com/api/groups/recommendations');
      setRecommendedGroups(res.data);
    } catch (err) {
      console.error('Failed to fetch group recommendations:', err);
      if (err.response) {
        setError('Server error. Please try again later.');
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="group-recommendations" style={{ padding: '20px' }}>
      <h2>Recommended Groups</h2>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
      )}

      {!loading && recommendedGroups.length > 0 && (
        <ul className="group-list" style={{ listStyleType: 'none', padding: '0' }}>
          {recommendedGroups.map((group, index) => (
            <li
              key={index}
              className="group-item"
              style={{
                marginBottom: '15px',
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            >
              <h3>{group.name}</h3>
              <p>{group.description}</p>
              <button
                style={{
                  marginTop: '10px',
                  padding: '10px 15px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  borderRadius: '5px',
                }}
              >
                Join Group
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && recommendedGroups.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No group recommendations available at the moment.</p>
      )}
    </div>
  );
};

export default GroupRecommendations;
