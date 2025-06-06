import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/apiConfig';

const RevenueSourceForm = () => {
  const [form, setForm] = useState({ name: '', description: '', account: '' });
  const [revenueSources, setRevenueSources] = useState([]);
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
      await Promise.all([fetchRevenueSources(), fetchAccounts()]);
    };
    fetchInitialData();
  }, [navigate]);

  const fetchRevenueSources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/revenue-sources', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRevenueSources(response.data.revenueSources);
    } catch (err) {
      console.error('Error fetching revenue sources:', err.response?.data?.message || err.message);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter for active revenue accounts
      setAccounts(response.data.accounts.filter(account => account.isActive && account.type === 'revenue'));
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
      await API.post('/api/revenue-sources', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Revenue source added successfully');
      setForm({ name: '', description: '', account: '' });
      fetchRevenueSources();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add revenue source. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this revenue source?')) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await API.delete(`/api/revenue-sources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Revenue source deleted successfully');
      fetchRevenueSources();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete revenue source. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'Special User') {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        Access denied: Only Special Users can manage revenue sources.
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header Section */}
      <div className="bg-blue-50 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-blue-700">Revenue Source Management</h1>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100">
        {/* Error and Success Messages */}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

        {/* Add Revenue Source Form */}
        <div className="bg-white shadow-md rounded p-6 mb-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Revenue Source</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Enter revenue source name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="p-2 border rounded w-full mt-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  placeholder="Enter revenue source description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="p-2 border rounded w-full mt-1"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Revenue Account</label>
                <select
                  value={form.account}
                  onChange={(e) => setForm({ ...form, account: e.target.value })}
                  className="p-2 border rounded w-full mt-1"
                  required
                >
                  <option value="">Select a revenue account</option>
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
              {loading ? 'Processing...' : 'Add Revenue Source'}
            </button>
          </form>
        </div>

        {/* Revenue Source List Table */}
        <div className="bg-white shadow-md rounded p-6 max-w-4xl mx-auto overflow-y-auto max-h-[50vh]">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Existing Revenue Sources</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Revenue Account</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {revenueSources.length > 0 ? (
                revenueSources.map((source) => (
                  <tr key={source._id} className="hover:bg-gray-50 transition">
                    <td className="border p-2">{source.name}</td>
                    <td className="border p-2">{source.description}</td>
                    <td className="border p-2">
                      {accounts.find(a => a._id === (source.account?._id || source.account))?.name || 'Not linked'}
                    </td>
                    <td className="border p-2 flex justify-center space-x-2">
                      <button
                        onClick={() => handleDelete(source._id)}
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
                  <td colSpan="4" className="border p-2 text-center text-gray-500">
                    No revenue sources found
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

export default RevenueSourceForm; 