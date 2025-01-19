import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/apiConfig';

const Expenditure = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    description: '',
    year: new Date().getFullYear(),
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [collapsedMonths, setCollapsedMonths] = useState({});
  const [userName, setUserName] = useState('');
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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get('/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data?.message || error.message);
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

      setForm({ category: '', amount: '', description: '', year: new Date().getFullYear() });
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
    fetchCategories();
    fetchUserName();
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
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
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
                    <th className="border p-2">Category</th>
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
                      <td className="border p-2">{expenditure.category?.name || 'N/A'}</td>
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
                                category: expenditure.category?._id || '',
                                amount: expenditure.amount,
                                description: expenditure.description,
                                year: expenditure.year,
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
