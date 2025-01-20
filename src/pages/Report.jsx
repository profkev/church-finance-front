import React, { useState, useEffect } from 'react';
import API from '../utils/apiConfig';

const Reports = () => {
  const [filterType, setFilterType] = useState('income'); // Original data filter type
  const [combinedFilterType, setCombinedFilterType] = useState('income'); // Combined data filter type
  const [data, setData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('original'); // Section switch: original or combined
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [isExpanded, setIsExpanded] = useState(true); // Toggle expand/collapse

  // Fetch original data
  const fetchOriginalData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/reports`, {
        params: { type: filterType },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setData(Array.isArray(response.data.records) ? response.data.records : []);
    } catch (error) {
      console.error('Error fetching original data:', error.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch combined data
  const fetchCombinedData = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/api/reports/aggregated`, {
        params: { type: combinedFilterType, month, year },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCombinedData(Array.isArray(response.data.aggregatedData) ? response.data.aggregatedData : []);
    } catch (error) {
      console.error('Error fetching combined data:', error.message);
      setCombinedData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data based on active section
  useEffect(() => {
    if (activeSection === 'original') {
      fetchOriginalData();
    } else {
      fetchCombinedData();
    }
  }, [activeSection, filterType, combinedFilterType, month, year]);

  // Download original data (Excel or PDF)
// Download original data (Excel or PDF)
const downloadOriginalData = async (format) => {
    try {
      // Ensure endpoint matches backend routes
      const endpoint = format === 'pdf' ? 'download/original/pdf' : 'download/original';
      const response = await API.get(`/api/reports/${endpoint}`, {
        params: { type: filterType },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob', // Handle file blob
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `original_data.${format}`);
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading original data:', error.message);
    }
  };
  
  const downloadCombinedData = async (format) => {
    try {
      const endpoint = format === 'pdf' ? 'download/combined/pdf' : 'download/combined';
      const response = await API.get(`/api/reports/${endpoint}`, {
        params: { type: combinedFilterType, month, year },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob', // Handle file blob
      });
  
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `combined_data.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading combined ${format.toUpperCase()}:`, error.message);
    }
  };
  
  
  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 bg-gray-50 flex-shrink-0">
        <h1 className="text-3xl font-bold text-center mb-6">Report Management</h1>

        {/* Section Tabs */}
        <div className="mb-6 flex justify-center space-x-4">
          <button
            className={`py-2 px-4 rounded ${activeSection === 'original' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveSection('original')}
          >
            Original Data
          </button>
          <button
            className={`py-2 px-4 rounded ${activeSection === 'combined' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveSection('combined')}
          >
            Combined Data
          </button>
        </div>

        {/* Expand/Collapse Filters */}
        <div className="mb-6 text-right">
          <button
            className="text-blue-500 underline"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse Filters' : 'Expand Filters'}
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 bg-gray-100">
        {isExpanded && (
          <div className="mb-6 bg-white p-4 shadow rounded">
            {activeSection === 'original' ? (
              <div>
                <h2 className="text-lg font-semibold mb-4">Filter Original Reports</h2>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="income">Income</option>
                  <option value="expenditure">Expenditure</option>
                </select>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4">Filter Combined Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={combinedFilterType}
                    onChange={(e) => setCombinedFilterType(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    <option value="income">Income</option>
                    <option value="expenditure">Expenditure</option>
                  </select>
                  <input
                    type="month"
                    value={`${year}-${month}`}
                    onChange={(e) => {
                      const [y, m] = e.target.value.split('-');
                      setYear(y);
                      setMonth(m);
                    }}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-4">
            {activeSection === 'original' ? 'Preview Original Data' : 'Preview Combined Data'}
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : activeSection === 'original' ? (
            data.length === 0 ? (
              <p>No data available for the selected filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Votehead</th>
                      <th className="border p-2">Amount</th>
                      <th className="border p-2">Description</th>
                      <th className="border p-2">Year</th>
                      <th className="border p-2">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="border p-2">{item._id}</td>
                        <td className="border p-2">{item.votehead?.name || 'N/A'}</td>
                        <td className="border p-2">{item.amount}</td>
                        <td className="border p-2">{item.description}</td>
                        <td className="border p-2">{item.year}</td>
                        <td className="border p-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : combinedData.length === 0 ? (
            <p>No combined data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2">{item.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex space-x-4">
          {activeSection === 'original' ? (
            <>
              <button
                onClick={() => downloadOriginalData('pdf')}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Download PDF
              </button>
              <button
                onClick={() => downloadOriginalData('excel')}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Download Excel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => downloadCombinedData('pdf')}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Download PDF
              </button>
              <button
                onClick={() => downloadCombinedData('excel')}
                className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
              >
                Download Excel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
