import React, { useState, useEffect } from 'react';
import API from '../utils/apiConfig';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Visualizations = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenditureData, setExpenditureData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIncomeData = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/reports/aggregated', {
        params: { type: 'income' },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setIncomeData(response.data.aggregatedData || []);
    } catch (error) {
      console.error('Error fetching income data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenditureData = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/reports/aggregated', {
        params: { type: 'expenditure' },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setExpenditureData(response.data.aggregatedData || []);
    } catch (error) {
      console.error('Error fetching expenditure data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeData();
    fetchExpenditureData();
  }, []);

  const incomeChartData = {
    labels: incomeData.map((item) => item.name || 'N/A'),
    datasets: [
      {
        label: 'Income Amount',
        data: incomeData.map((item) => item.totalAmount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const expenditureChartData = {
    labels: expenditureData.map((item) => item.name || 'N/A'),
    datasets: [
      {
        label: 'Expenditure Amount',
        data: expenditureData.map((item) => item.totalAmount),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const combinedChartData = {
    labels: ['Income', 'Expenditure'],
    datasets: [
      {
        label: 'Total Amount',
        data: [
          incomeData.reduce((acc, item) => acc + item.totalAmount, 0),
          expenditureData.reduce((acc, item) => acc + item.totalAmount, 0),
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Data Visualizations</h1>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[calc(100vh-100px)]">
          {/* Income Bar Chart */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Income Overview</h2>
            <Bar data={incomeChartData} options={{ responsive: true }} />
          </div>

          {/* Expenditure Bar Chart */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Expenditure Overview</h2>
            <Bar data={expenditureChartData} options={{ responsive: true }} />
          </div>

          {/* Combined Pie Chart */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Income vs Expenditure</h2>
            <Pie data={combinedChartData} options={{ responsive: true }} />
          </div>

          {/* Summary Statistics */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <p>Total Income: KES {incomeData.reduce((acc, item) => acc + item.totalAmount, 0)}</p>
            <p>Total Expenditure: KES {expenditureData.reduce((acc, item) => acc + item.totalAmount, 0)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualizations;
