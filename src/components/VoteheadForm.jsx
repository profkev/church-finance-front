import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/apiConfig';

const VoteheadForm = () => {
  const [form, setForm] = useState({ name: '', description: '', account: '' });
  const [voteheads, setVoteheads] = useState([]);
  const [accounts, setAccounts] = useState([]);
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
      await Promise.all([fetchVoteheads(), fetchAccounts()]);
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

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter for active expense accounts
      setAccounts(response.data.accounts.filter(account => account.isActive && account.type === 'expense'));
    } catch (err) {
      console.error('Error fetching accounts:', err.response?.data?.message || err.message);
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
      setSuccess('Votehead added successfully');
      setForm({ name: '', description: '', account: '' });
      fetchVoteheads();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add votehead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      fetchVoteheads();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete votehead. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'Special User') {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Access denied: Only Special Users can manage voteheads.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-50 to-blue-100 pb-24">
      {/* Header Section */}
      <div className="bg-blue-50 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-blue-700">Votehead Management</h1>
      </div>
      <div className="flex-grow overflow-y-auto mt-16 sm:mt-0">
        <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl mx-auto px-2">
          {/* Error and Success Messages */}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
          {/* Add Votehead Form */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Votehead</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter votehead name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="p-2 border rounded w-full mt-1"
                  required
                />
                <textarea
                  placeholder="Enter votehead description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="p-2 border rounded w-full mt-1"
                  required
                />
                <div className="md:col-span-2">
                  <select
                    value={form.account}
                    onChange={(e) => setForm({ ...form, account: e.target.value })}
                    className="p-2 border rounded w-full mt-1"
                    required
                  >
                    <option value="">Select an expense account</option>
                    {accounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.name} ({account.code})
                      </option>
                    ))}
                  </select>
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
          </div>
          {/* Table Section - Scrollable */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Existing Voteheads</h2>
            </div>
            <div className="h-[calc(100vh-400px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {voteheads.length > 0 ? (
                    voteheads.map((votehead) => (
                      <tr key={votehead._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{votehead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{votehead.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {accounts.find(a => a._id === (votehead.account?._id || votehead.account))?.name || 'Not linked'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center space-x-2">
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
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No voteheads found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteheadForm;
