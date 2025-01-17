import React, { useState, useEffect } from 'react';
import API from '../utils/apiConfig'; // Centralized API configuration

const VoteheadForm = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [voteheads, setVoteheads] = useState([]); // State to store all voteheads
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [role, setRole] = useState(''); // User role
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch the user's role and voteheads on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        setRole(user.role);
      }
      await fetchVoteheads();
    };
    fetchInitialData();
  }, []);

  // Fetch all voteheads
  const fetchVoteheads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/voteheads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVoteheads(response.data.voteheads);
    } catch (err) {
      console.error('Error fetching voteheads:', err.response?.data?.message || err.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await API.post('/api/voteheads', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Votehead added successfully');
      setForm({ name: '', description: '' }); // Reset the form
      fetchVoteheads(); // Refresh votehead list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add votehead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle votehead deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this votehead?')) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/api/voteheads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Votehead deleted successfully');
      fetchVoteheads(); // Refresh votehead list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete votehead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Restrict access if the user is not a Special User
  if (role !== 'Special User') {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Access denied: Only Special Users can manage voteheads.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded p-6 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Voteheads</h1>

      {/* Error and Success Messages */}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

      {/* Add Votehead Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Enter votehead description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="p-2 border rounded w-full mt-1"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Add Votehead'}
        </button>
      </form>

      {/* Votehead List Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {voteheads.length > 0 ? (
            voteheads.map((votehead) => (
              <tr key={votehead._id} className="hover:bg-gray-50 transition">
                <td className="border p-2">{votehead.name}</td>
                <td className="border p-2">{votehead.description}</td>
                <td className="border p-2 flex justify-center space-x-2">
                  <button
                    onClick={() => handleDelete(votehead._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-4">
                No voteheads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VoteheadForm;
