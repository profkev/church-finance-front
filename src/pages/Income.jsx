import React, { useState, useEffect } from 'react';
import API from '../utils/apiConfig';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [voteheads, setVoteheads] = useState([]);
  const [form, setForm] = useState({
    votehead: '',
    amount: '',
    description: '',
    year: new Date().getFullYear(),
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsedMonths, setCollapsedMonths] = useState({});
  const [userName, setUserName] = useState('');

  const fetchIncomes = async () => {
    try {
      const response = await API.get('/api/incomes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIncomes(response.data.incomes);
    } catch (error) {
      console.error('Error fetching incomes:', error.response?.data?.message);
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

  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data.name);
    } catch (error) {
      console.error('Error fetching user name:', error.response?.data?.message || error.message);
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
        return;
      }

      const payload = { ...form };
      if (editId) {
        await API.put(`/api/incomes/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditId(null);
      } else {
        await API.post('/api/incomes', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ votehead: '', amount: '', description: '', year: new Date().getFullYear() });
      fetchIncomes();
    } catch (error) {
      console.error('Error saving income:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || 'An error occurred while saving the income.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await API.delete(`/api/incomes/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchIncomes();
    } catch (error) {
      console.error('Error deleting income:', error.response?.data?.message);
    }
  };

  const toggleMonth = (month) => {
    setCollapsedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const groupIncomesByMonth = () => {
    const grouped = incomes.reduce((acc, income) => {
      const date = new Date(income.createdAt);
      const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(income);
      return acc;
    }, {});
    return grouped;
  };

  useEffect(() => {
    fetchIncomes();
    fetchVoteheads();
    fetchUserName();
  }, []);

  const groupedIncomes = groupIncomesByMonth();

  const grandTotal = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar Space */}
      <div className="hidden lg:block w-64 bg-gray-200 min-h-screen"></div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Income Management</h1>

        {/* Income Form */}
        <form className="mb-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={form.votehead}
              onChange={(e) => setForm({ ...form, votehead: e.target.value })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Votehead</option>
              {voteheads.map((votehead) => (
                <option key={votehead._id} value={votehead._id}>{votehead.name}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-1 md:col-span-2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ease-in-out duration-200"
            disabled={loading}
          >
            {loading ? 'Processing...' : editId ? 'Update Income' : 'Add Income'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        {/* Income Table by Month */}
        {Object.keys(groupedIncomes).map((month) => (
          <div key={month} className="mb-6">
            <div
              className="bg-blue-200 p-3 cursor-pointer font-bold flex justify-between items-center rounded-lg shadow-md"
              onClick={() => toggleMonth(month)}
            >
              <span>{month}</span>
              <span>Total: {groupedIncomes[month].reduce((sum, income) => sum + income.amount, 0)}</span>
            </div>
            {!collapsedMonths[month] && (
              <table className="w-full border-collapse border border-gray-300 mt-3 rounded-md overflow-hidden">
                <thead>
                  <tr className="bg-blue-300">
                    <th className="border p-2">Votehead</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Day</th>
                    <th className="border p-2">User</th>
                    {userName === 'Admin' && <th className="border p-2">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {groupedIncomes[month].map((income) => (
                    <tr key={income._id} className="hover:bg-blue-50 transition">
                      <td className="border p-2">{income.votehead?.name || 'N/A'}</td>
                      <td className="border p-2">{income.amount}</td>
                      <td className="border p-2">{income.description}</td>
                      <td className="border p-2">
                        {new Date(income.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short', day: 'numeric', month: 'short',
                        })}
                      </td>
                      <td className="border p-2">{income.user || 'Unknown'}</td>
                      {userName === 'Admin' && (
                        <td className="border p-2 flex justify-center space-x-2">
                          <button
                            onClick={() => {
                              setForm({
                                votehead: income.votehead?._id || '',
                                amount: income.amount,
                                description: income.description,
                                year: income.year,
                              });
                              setEditId(income._id);
                            }}
                            className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(income._id)}
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
        <div className="mt-6 bg-blue-300 p-3 text-center font-bold rounded-lg shadow-lg">
          Grand Total: {grandTotal}
        </div>
      </div>
    </div>
  );
};

export default Income;
