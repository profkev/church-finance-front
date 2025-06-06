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
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-50 to-blue-100 pb-24">
      {/* Header Section */}
      <div className="bg-blue-50 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-blue-700">Revenue Source Management</h1>
      </div>
      <div className="flex-grow overflow-y-auto mt-16 sm:mt-0">
        <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl mx-auto px-2">
          {/* Error and Success Messages */}
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
          {/* Add Revenue Source Form */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Revenue Source</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter revenue source name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="p-2 border rounded w-full mt-1"
                  required
                />
                <textarea
                  placeholder="Enter revenue source description"
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
          {/* Table Section - Scrollable */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Existing Revenue Sources</h2>
            </div>
            <div className="h-[calc(100vh-400px)] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Revenue Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {revenueSources.map((source) => (
                    <tr key={source._id} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {source.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {source.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {source.account?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(source._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueSourceForm; 