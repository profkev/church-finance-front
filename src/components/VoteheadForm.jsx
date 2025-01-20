import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/apiConfig';

const VoteheadForm = () => {
  const [form, setForm] = useState({ name: '', description: '' });
  const [voteheads, setVoteheads] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user) {
        navigate('/login');
        return;
      }

      setRole(user.role);
      await fetchVoteheads();
    };

    fetchInitialData();
  }, [navigate]);

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
      setSuccess('Income category added successfully');
      setForm({ name: '', description: '' });
      fetchVoteheads();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add Income. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Income Category?')) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/api/voteheads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Income deleted successfully');
      fetchVoteheads();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete Income. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'Special User') {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Access denied: Only Special Users can manage income.
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header Section */}
      <div className="bg-blue-50 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-blue-700">Manage Income</h1>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100">
        {/* Error and Success Messages */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        {/* Add Votehead Form */}
        <div className="bg-white shadow-md rounded p-6 mb-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Income Category</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Enter Income name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="p-2 border rounded w-full mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  placeholder="Enter Income description"
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
              {loading ? 'Processing...' : 'Add Income'}
            </button>
          </form>
        </div>

        {/* Votehead List Table */}
        <div className="bg-white shadow-md rounded p-6 max-w-4xl mx-auto overflow-y-auto max-h-[50vh]">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Existing Incomes</h2>
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
                    No Income found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VoteheadForm;
