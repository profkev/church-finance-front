import React, { useState, useEffect, useCallback } from 'react';
import API from '../utils/apiConfig';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Special User' });

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/api/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('All fields are required.');
      return;
    }
    try {
      await API.post('/api/users/invite', formData);
      setFormData({ name: '', email: '', password: '', role: 'Special User' });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/api/users/${userId}`);
        fetchUsers(); // Refresh the user list
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

      {/* Invite User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Invite New User</h2>
        <form onSubmit={handleInviteUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Temporary Password"
            value={formData.password}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="Special User">Special User</option>
            <option value="Member">Member</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 md:col-span-2">
            Invite User
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Current Users</h2>
        {isLoading ? (
          <p>Loading users...</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border rounded">
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">Role: {user.role}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="mt-2 md:mt-0 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 