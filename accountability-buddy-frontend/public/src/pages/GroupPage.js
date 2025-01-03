import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupPage = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch groups when the component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('https://accountabilitybuddys.com/api/groups');
        setGroups(res.data);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
        setError('Failed to fetch groups. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  // Create a new group
  const createGroup = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccessMessage('');

    // Basic validation
    if (!name || !interests) {
      setError('Please fill in all fields.');
      setCreating(false);
      return;
    }

    try {
      const res = await axios.post('https://accountabilitybuddys.com/api/groups', { name, interests });
      if (res.data.success) {
        setGroups([...groups, res.data.group]);
        setSuccessMessage('Group created successfully!');
        setName('');
        setInterests('');
      } else {
        setError('Failed to create group. Please try again.');
      }
    } catch (err) {
      console.error('Failed to create group:', err);
      setError('An error occurred while creating the group.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="group-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Groups</h1>

      {loading && <p>Loading groups...</p>}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message" role="alert" style={{ color: 'green', marginBottom: '20px' }}>
          {successMessage}
        </div>
      )}

      {!loading && (
        <>
          <form onSubmit={createGroup} style={{ marginBottom: '30px' }}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="name">Group Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', margin: '5px 0' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="interests">Group Interests:</label>
              <input
                type="text"
                id="interests"
                name="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                required
                style={{ width: '100%', padding: '10px', margin: '5px 0' }}
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {creating ? 'Creating...' : 'Create Group'}
            </button>
          </form>

          <ul className="group-list" style={{ listStyleType: 'none', padding: '0' }}>
            {groups.map((group, index) => (
              <li
                key={index}
                style={{
                  marginBottom: '15px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                }}
              >
                <h3>{group.name}</h3>
                <p>Interests: {group.interests}</p>
              </li>
            ))}
          </ul>

          {!loading && groups.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>No groups available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default GroupPage;
