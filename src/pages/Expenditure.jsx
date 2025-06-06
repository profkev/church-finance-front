import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/apiConfig';

const Expenditure = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    votehead: '',
    amount: '',
    description: '',
    year: new Date().getFullYear(),
    assetAccount: '',
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsedMonths, setCollapsedMonths] = useState({});
  const [userName, setUserName] = useState('');
  const [voteheads, setVoteheads] = useState([]);
  const navigate = useNavigate();

  const fetchExpenditures = async () => {
    try {
      const response = await API.get('/api/expenditures', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setExpenditures(response.data.expenditures);
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
      console.error('Error fetching expenditures:', error.response?.data?.message);
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data.accounts.filter(a => a.isActive && a.type === 'asset'));
    } catch (error) {
      console.error('Error fetching accounts:', error.response?.data?.message || error.message);
    }
  };

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data.name);
    } catch (error) {
      if (error.response?.status === 401) navigate('/login');
      console.error('Error fetching user name:', error.response?.data?.message || error.message);
    }
  };

  const fetchVoteheads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/voteheads', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVoteheads(response.data.voteheads);
    } catch (error) {
      console.error('Error fetching voteheads:', error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User not authenticated.');
        navigate('/login');
        return;
      }

      const payload = { ...form };
      if (editId) {
        await API.put(`/api/expenditures/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      } else {
        await API.post('/api/expenditures', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ votehead: '', amount: '', description: '', year: new Date().getFullYear(), assetAccount: '' });
      fetchExpenditures();
    } catch (error) {
      console.error('Error saving expenditure:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'An error occurred while saving the expenditure.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await API.delete(`/api/expenditures/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchExpenditures();
    } catch (error) {
      console.error('Error deleting expenditure:', error.response?.data?.message);
    }
  };

  const toggleMonth = (month) => {
    setCollapsedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const groupExpendituresByMonth = () => {
    const grouped = expenditures.reduce((acc, expenditure) => {
      const date = new Date(expenditure.createdAt);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(expenditure);
      return acc;
    }, {});
    return grouped;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchExpenditures();
    fetchAccounts();
    fetchUserName();
    fetchVoteheads();
  }, [navigate]);

  const groupedExpenditures = groupExpendituresByMonth();

  const grandTotal = expenditures.reduce((sum, expenditure) => sum + expenditure.amount, 0);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-r from-green-50 to-green-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Expenditure Management</h1>

        {/* Expenditure Form */}
        <form className="mb-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={form.votehead}
              onChange={(e) => setForm({ ...form, votehead: e.target.value })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Votehead</option>
              {voteheads.map((votehead) => (
                <option key={votehead._id} value={votehead._id}>{votehead.name}</option>
              ))}
            </select>

            <select
              value={form.assetAccount}
              onChange={(e) => setForm({ ...form, assetAccount: e.target.value })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Account (Cash/Bank)</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>{account.code} - {account.name}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 col-span-1 md:col-span-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition ease-in-out duration-200"
            disabled={loading}
          >
            {loading ? 'Processing...' : editId ? 'Update Expenditure' : 'Add Expenditure'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        {/* Expenditure Table by Month */}
        {Object.keys(groupedExpenditures).map((month) => (
          <div key={month} className="mb-6">
            <div
              className="bg-green-200 p-3 cursor-pointer font-bold flex justify-between items-center rounded-lg shadow-md"
              onClick={() => toggleMonth(month)}
            >
              <span>{month}</span>
              <span>Total: {groupedExpenditures[month].reduce((sum, expenditure) => sum + expenditure.amount, 0)}</span>
            </div>
            {!collapsedMonths[month] && (
              <table className="w-full border-collapse border border-gray-300 mt-3 rounded-md overflow-hidden">
                <thead>
                  <tr className="bg-green-300">
                    <th className="border p-2">Votehead</th>
                    <th className="border p-2">Account</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Day</th>
                    <th className="border p-2">User</th>
                    {userName === 'Admin' && <th className="border p-2">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {groupedExpenditures[month].map((expenditure) => (
                    <tr key={expenditure._id} className="hover:bg-green-50 transition">
                      <td className="border p-2">{expenditure.votehead?.name || 'N/A'}</td>
                      <td className="border p-2">{accounts.find(a => a._id === expenditure.assetAccount)?.name || 'N/A'}</td>
                      <td className="border p-2">{expenditure.amount}</td>
                      <td className="border p-2">{expenditure.description}</td>
                      <td className="border p-2">
                        {new Date(expenditure.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short', day: 'numeric', month: 'short',
                        })}
                      </td>
                      <td className="border p-2">{expenditure.user || 'Unknown'}</td>
                      {userName === 'Admin' && (
                        <td className="border p-2 flex justify-center space-x-2">
                          <button
                            onClick={() => {
                              setForm({
                                votehead: expenditure.votehead?._id || '',
                                amount: expenditure.amount,
                                description: expenditure.description,
                                year: expenditure.year,
                                assetAccount: expenditure.assetAccount || '',
                              });
                              setEditId(expenditure._id);
                            }}
                            className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(expenditure._id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}

        {/* Grand Total */}
        <div className="mt-6 bg-green-300 p-3 text-center font-bold rounded-lg shadow-lg">
          Grand Total: {grandTotal}
        </div>
      </div>
    </div>
  );
};

export default Expenditure;
