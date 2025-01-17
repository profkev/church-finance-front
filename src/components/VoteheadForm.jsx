import React, { useState, useEffect } from 'react';
import API from '../utils/apiConfig'; // Centralized API configuration

const VoteheadForm = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [role, setRole] = useState(''); // User role

  // Fetch the user's role on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setRole(user.role);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await API.post('/api/voteheads', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Votehead added successfully');
      setForm({ name: '', description: '' }); // Reset the form
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add votehead. Please try again.');
    }
  };

  // Restrict access if the user is not a Special User
  if (role !== 'Special User') {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Access denied: Only Special Users can add voteheads.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4">Add Votehead</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            placeholder="Enter votehead name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded w-full mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Enter votehead description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="p-2 border rounded w-full mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Votehead
        </button>
      </form>
    </div>
  );
};

export default VoteheadForm;
