import React, { useEffect, useState } from 'react';
import API from '../utils/apiConfig';
import { useNavigate } from 'react-router-dom';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ code: '', name: '', type: 'asset', description: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    setRole(user.role);
    fetchAccounts();
  }, [navigate]);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data.accounts);
    } catch (err) {
      setError('Failed to fetch accounts.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (editId) {
        await API.put(`/api/accounts/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Account updated successfully.');
      } else {
        await API.post('/api/accounts', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Account added successfully.');
      }
      setForm({ code: '', name: '', type: 'asset', description: '' });
      setEditId(null);
      fetchAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save account.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (account) => {
    setForm({ code: account.code, name: account.name, type: account.type, description: account.description });
    setEditId(account._id);
  };

  const handleToggleActive = async (id) => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await API.patch(`/api/accounts/${id}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Account status updated.');
      fetchAccounts();
    } catch (err) {
      setError('Failed to update account status.');
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'Special User') {
    return <div className="bg-red-100 text-red-700 p-4 rounded">Access denied: Only Special Users can manage accounts.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded p-6 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Account Management</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="text" placeholder="Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="p-2 border rounded" required disabled={!!editId} />
        <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" required />
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="p-2 border rounded" required disabled={!!editId}>
          <option value="asset">Asset</option>
          <option value="liability">Liability</option>
          <option value="equity">Equity</option>
          <option value="revenue">Revenue</option>
          <option value="expense">Expense</option>
        </select>
        <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="p-2 border rounded" />
        <button type="submit" className="col-span-1 md:col-span-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={loading}>{loading ? 'Processing...' : editId ? 'Update Account' : 'Add Account'}</button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Code</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={account._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{account.code}</td>
                <td className="px-4 py-2 border">{account.name}</td>
                <td className="px-4 py-2 border capitalize">{account.type}</td>
                <td className="px-4 py-2 border">{account.description}</td>
                <td className="px-4 py-2 border">{account.isActive ? 'Active' : 'Inactive'}</td>
                <td className="px-4 py-2 border flex flex-col md:flex-row gap-2">
                  <button onClick={() => handleEdit(account)} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={() => handleToggleActive(account._id)} className={`py-1 px-3 rounded ${account.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}>{account.isActive ? 'Deactivate' : 'Activate'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountManagement; 