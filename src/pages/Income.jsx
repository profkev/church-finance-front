import React, { useState, useEffect } from 'react';
import API from '../utils/apiConfig'; // Import the API configuration
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const Income = () => {
  const [incomes, setIncomes] = useState([]); // Income records
  const [voteheads, setVoteheads] = useState([]); // Available voteheads
  const [form, setForm] = useState({ votehead: '', amount: '', description: '', year: new Date().getFullYear() }); // Form state
  const [editId, setEditId] = useState(null); // Track the record being edited
  const [error, setError] = useState(''); // To handle error messages
  const [loading, setLoading] = useState(false); // To handle loading state

  const navigate = useNavigate(); // UseNavigate hook to navigate between routes

  // Fetch income records
  const fetchIncomes = async () => {
    try {
      const response = await API.get('/api/incomes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIncomes(response.data.incomes);
    } catch (error) {
      console.error('Error fetching incomes:', error.response?.data?.message || error.message);
    }
  };

  // Fetch voteheads
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

  // Handle form submission
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
  
  // Handle delete
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

  // Load income records and voteheads on mount
  useEffect(() => {
    fetchIncomes();
    fetchVoteheads();
  }, []);

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h1 className="text-2xl font-bold mb-4">Income Management</h1>

      {/* Income Form */}
      <form className="mb-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            value={form.votehead}
            onChange={(e) => setForm({ ...form, votehead: e.target.value })}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Votehead</option>
            {voteheads.map((votehead) => (
              <option key={votehead._id} value={votehead._id}>
                {votehead.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            className="p-2 border rounded"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="p-2 border rounded col-span-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : editId ? 'Update Income' : 'Add Income'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {/* Income Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Votehead</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.length > 0 ? (
            incomes.map((income) => (
              <tr key={income._id}>
                <td className="border p-2">{income.votehead?.name || 'N/A'}</td>
                <td className="border p-2">{income.amount}</td>
                <td className="border p-2">{income.description}</td>
                <td className="border p-2">{income.user || 'N/A'}</td>
                <td className="border p-2">{new Date(income.createdAt).toLocaleString()}</td>
                <td className="border p-2 flex justify-center space-x-2">
                  <button
                    onClick={() => {
                      setForm({
                        votehead: income.votehead?._id || '',
                        amount: income.amount,
                        description: income.description,
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No income records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Income;
