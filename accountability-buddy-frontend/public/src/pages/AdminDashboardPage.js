import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboardPage.css'; // Import custom styles

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data.users);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users by search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Block or unblock a user
  const toggleUserStatus = async (userId, action) => {
    setProcessing(true);
    setError('');
    try {
      await axios.post(`/api/admin/users/${userId}/${action}`, null, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, active: action === 'unblock' } : user
        )
      );
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      setError(`Failed to ${action} user. Please try again.`);
    } finally {
      setProcessing(false);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setProcessing(true);
    setError('');
    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="admin-dashboard" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Admin Dashboard</h1>

      {loading && <p>Loading users...</p>}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {!loading && (
        <>
          <div className="search-bar" style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}
            />
          </div>

          <table className="users-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Username</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Email</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Status</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} style={{ textAlign: 'center' }}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{user.username}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{user.email}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                      {user.active ? 'Active' : 'Blocked'}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                      {user.active ? (
                        <button
                          onClick={() => toggleUserStatus(user.id, 'block')}
                          disabled={processing}
                          style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleUserStatus(user.id, 'unblock')}
                          disabled={processing}
                          style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                          Unblock
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(user.id)}
                        disabled={processing}
                        style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '10px' }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
