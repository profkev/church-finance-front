import React, { useEffect, useState } from 'react';
import API from '../utils/apiConfig';
import { useNavigate } from 'react-router-dom';

const emptyLine = { account: '', debit: 0, credit: 0, description: '' };

const JournalEntries = () => {
  const [entries, setEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ date: '', reference: '', description: '', lines: [ { ...emptyLine } ] });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [viewEntry, setViewEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    setRole(user.role);
    fetchEntries();
    fetchAccounts();
  }, [navigate]);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/journal-entries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data.entries);
    } catch (err) {
      setError('Failed to fetch journal entries.');
    }
  };

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await API.get('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data.accounts.filter(a => a.isActive));
    } catch (err) {
      setError('Failed to fetch accounts.');
    }
  };

  const handleLineChange = (idx, field, value) => {
    const newLines = form.lines.map((line, i) => i === idx ? { ...line, [field]: value } : line);
    setForm({ ...form, lines: newLines });
  };

  const addLine = () => setForm({ ...form, lines: [ ...form.lines, { ...emptyLine } ] });
  const removeLine = (idx) => setForm({ ...form, lines: form.lines.filter((_, i) => i !== idx) });

  const totalDebit = form.lines.reduce((sum, l) => sum + Number(l.debit), 0);
  const totalCredit = form.lines.reduce((sum, l) => sum + Number(l.credit), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        date: form.date,
        reference: form.reference,
        description: form.description,
        entries: form.lines.map(l => ({
          account: l.account,
          debit: Number(l.debit),
          credit: Number(l.credit),
          description: l.description
        })),
        status: 'posted'
      };
      await API.post('/api/journal-entries', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Journal entry added successfully.');
      setForm({ date: '', reference: '', description: '', lines: [ { ...emptyLine } ] });
      setShowForm(false);
      fetchEntries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add journal entry.');
    } finally {
      setLoading(false);
    }
  };

  if (role !== 'Special User') {
    return <div className="bg-red-100 text-red-700 p-4 rounded">Access denied: Only Special Users can manage journal entries.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded p-6 w-full max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Journal Entry Management</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
      <button onClick={() => setShowForm(!showForm)} className="mb-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        {showForm ? 'Cancel' : 'Add Journal Entry'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="p-2 border rounded" required />
            <input type="text" placeholder="Reference" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} className="p-2 border rounded" required />
            <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="p-2 border rounded md:col-span-2" required />
          </div>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Account</th>
                  <th className="px-4 py-2 border">Debit</th>
                  <th className="px-4 py-2 border">Credit</th>
                  <th className="px-4 py-2 border">Line Description</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {form.lines.map((line, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border">
                      <select value={line.account} onChange={e => handleLineChange(idx, 'account', e.target.value)} className="p-2 border rounded" required>
                        <option value="">Select Account</option>
                        {accounts.map(acc => (
                          <option key={acc._id} value={acc._id}>{acc.code} - {acc.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      <input type="number" min="0" value={line.debit} onChange={e => handleLineChange(idx, 'debit', e.target.value)} className="p-2 border rounded w-24" required />
                    </td>
                    <td className="px-4 py-2 border">
                      <input type="number" min="0" value={line.credit} onChange={e => handleLineChange(idx, 'credit', e.target.value)} className="p-2 border rounded w-24" required />
                    </td>
                    <td className="px-4 py-2 border">
                      <input type="text" value={line.description} onChange={e => handleLineChange(idx, 'description', e.target.value)} className="p-2 border rounded" />
                    </td>
                    <td className="px-4 py-2 border">
                      {form.lines.length > 1 && (
                        <button type="button" onClick={() => removeLine(idx)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600">Remove</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" onClick={addLine} className="mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">Add Line</button>
          </div>
          <div className="mb-4 flex gap-4">
            <div className="font-semibold">Total Debit: <span className="text-blue-700">{totalDebit}</span></div>
            <div className="font-semibold">Total Credit: <span className="text-blue-700">{totalCredit}</span></div>
            {totalDebit !== totalCredit && <div className="text-red-600 font-semibold">Debits and Credits must balance!</div>}
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" disabled={loading || totalDebit !== totalCredit}>{loading ? 'Processing...' : 'Save Journal Entry'}</button>
        </form>
      )}
      <div className="overflow-x-auto">
        <div className="h-[calc(100vh-400px)] overflow-y-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Reference</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Total Debit</th>
                <th className="px-4 py-2 border">Total Credit</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{entry.reference}</td>
                  <td className="px-4 py-2 border">{entry.description}</td>
                  <td className="px-4 py-2 border text-right">{entry.totalDebit}</td>
                  <td className="px-4 py-2 border text-right">{entry.totalCredit}</td>
                  <td className="px-4 py-2 border capitalize">{entry.status}</td>
                  <td className="px-4 py-2 border">
                    <button onClick={() => setViewEntry(entry)} className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* View Entry Modal */}
      {viewEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl w-full relative">
            <button onClick={() => setViewEntry(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
            <h2 className="text-xl font-bold mb-2">Journal Entry Details</h2>
            <div className="mb-2">Date: {new Date(viewEntry.date).toLocaleDateString()}</div>
            <div className="mb-2">Reference: {viewEntry.reference}</div>
            <div className="mb-2">Description: {viewEntry.description}</div>
            <div className="mb-2">Status: {viewEntry.status}</div>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">Account</th>
                    <th className="px-4 py-2 border">Debit</th>
                    <th className="px-4 py-2 border">Credit</th>
                    <th className="px-4 py-2 border">Line Description</th>
                  </tr>
                </thead>
                <tbody>
                  {viewEntry.entries.map((line, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 border">{line.account?.code} - {line.account?.name}</td>
                      <td className="px-4 py-2 border text-right">{line.debit}</td>
                      <td className="px-4 py-2 border text-right">{line.credit}</td>
                      <td className="px-4 py-2 border">{line.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntries; 