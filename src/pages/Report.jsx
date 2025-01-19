import React, { useState, useEffect } from 'react';
import API from '../utils/apiConfig';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Reports = () => {
  const [reportData, setReportData] = useState([]);
  const [filter, setFilter] = useState({ type: 'all', month: '', year: new Date().getFullYear() });
  const [categories, setCategories] = useState([]);
  const [voteheads, setVoteheads] = useState([]);

  useEffect(() => {
    fetchReportData();
    fetchCategories();
    fetchVoteheads();
  }, []);

  const fetchReportData = async () => {
    try {
      const response = await API.get('/api/reports', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error.response?.data?.message || error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get('/api/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error.response?.data?.message || error.message);
    }
  };

  const fetchVoteheads = async () => {
    try {
      const response = await API.get('/api/voteheads', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setVoteheads(response.data.voteheads);
    } catch (error) {
      console.error('Error fetching voteheads:', error.response?.data?.message || error.message);
    }
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text('Report Summary', 14, 10);
    autoTable(doc, {
      head: [['Category/Votehead', 'Amount', 'Description', 'Date']],
      body: reportData.map((data) => [
        data.type === 'category' ? data.category?.name : data.votehead?.name,
        data.amount,
        data.description,
        new Date(data.date).toLocaleDateString(),
      ]),
    });
    doc.save('report-summary.pdf');
  };

  const handleGenerateExcel = () => {
    const worksheetData = reportData.map((data) => ({
      Type: data.type === 'category' ? 'Category' : 'Votehead',
      Name: data.type === 'category' ? data.category?.name : data.votehead?.name,
      Amount: data.amount,
      Description: data.description,
      Date: new Date(data.date).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Summary');
    XLSX.writeFile(workbook, 'report-summary.xlsx');
  };

  const handleFilter = async () => {
    try {
      const response = await API.get('/api/reports', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: filter,
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching filtered reports:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Report Management</h1>

      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Filter Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="all">All</option>
            <option value="category">By Category</option>
            <option value="votehead">By Votehead</option>
          </select>

          {filter.type === 'category' && (
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}

          {filter.type === 'votehead' && (
            <select
              value={filter.votehead}
              onChange={(e) => setFilter({ ...filter, votehead: e.target.value })}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select Votehead</option>
              {voteheads.map((votehead) => (
                <option key={votehead._id} value={votehead._id}>
                  {votehead.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="month"
            value={filter.month}
            onChange={(e) => setFilter({ ...filter, month: e.target.value })}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <button
            onClick={handleFilter}
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* Report Table */}
      <div className="mb-6 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold mb-4">Report Data</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Type</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((data) => (
              <tr key={data._id} className="hover:bg-gray-50">
                <td className="border p-2">{data.type === 'category' ? 'Category' : 'Votehead'}</td>
                <td className="border p-2">{data.type === 'category' ? data.category?.name : data.votehead?.name}</td>
                <td className="border p-2">{data.amount}</td>
                <td className="border p-2">{data.description}</td>
                <td className="border p-2">{new Date(data.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={handleGeneratePDF}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Download PDF
        </button>
        <button
          onClick={handleGenerateExcel}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>
    </div>
  );
};

export default Reports;
