import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/apiConfig';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [incomeData, setIncomeData] = useState([]);
  const [expenditureData, setExpenditureData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
    } else {
      setUserName(user.name || 'Guest');
      fetchSummaryData();
    }
  }, [navigate]);

  const fetchSummaryData = async () => {
    try {
      const incomeResponse = await API.get('/api/reports/aggregated', {
        params: { type: 'income' },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const expenditureResponse = await API.get('/api/reports/aggregated', {
        params: { type: 'expenditure' },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setIncomeData(incomeResponse.data.aggregatedData || []);
      setExpenditureData(expenditureResponse.data.aggregatedData || []);

      const totalIncome = incomeResponse.data.aggregatedData.reduce(
        (sum, item) => sum + item.totalAmount,
        0
      );
      const totalExpenditure = expenditureResponse.data.aggregatedData.reduce(
        (sum, item) => sum + item.totalAmount,
        0
      );

      setTotalIncome(totalIncome);
      setTotalExpenditure(totalExpenditure);
    } catch (error) {
      console.error('Error fetching summary data:', error.message);
    }
  };

  const incomeChartData = {
    labels: incomeData.map((item) => item.name || 'N/A'),
    datasets: [
      {
        label: 'Income',
        data: incomeData.map((item) => item.totalAmount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const expenditureChartData = {
    labels: expenditureData.map((item) => item.name || 'N/A'),
    datasets: [
      {
        label: 'Expenditure',
        data: expenditureData.map((item) => item.totalAmount),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Quick Links */}
      <div className="bg-blue-50 p-4 shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link to="/income" className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 text-center">
            <h2 className="font-bold text-lg lg:text-xl mb-2">Income</h2>
            <p className="text-sm lg:text-base">Manage income records and voteheads.</p>
          </Link>
          <Link to="/expenditure" className="bg-green-600 text-white p-4 rounded-lg shadow-md hover:bg-green-700 transition duration-200 text-center">
            <h2 className="font-bold text-lg lg:text-xl mb-2">Expenditure</h2>
            <p className="text-sm lg:text-base">Track expenses and manage expenditure details.</p>
          </Link>
          <Link to="/reports" className="bg-yellow-500 text-white p-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200 text-center">
            <h2 className="font-bold text-lg lg:text-xl mb-2">Reports</h2>
            <p className="text-sm lg:text-base">Generate and analyze financial reports.</p>
          </Link>
          <Link to="/voteheads" className="bg-purple-600 text-white p-4 rounded-lg shadow-md hover:bg-purple-700 transition duration-200 text-center">
            <h2 className="font-bold text-lg lg:text-xl mb-2">Voteheads</h2>
            <p className="text-sm lg:text-base">Manage voteheads for proper financial allocation.</p>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Dashboard</h1>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-700">Total Income</h2>
            <p className="text-3xl font-bold text-green-800 mt-2">KES {totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-red-700">Total Expenditure</h2>
            <p className="text-3xl font-bold text-red-800 mt-2">KES {totalExpenditure.toLocaleString()}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Income Chart */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Income Overview</h3>
            <Bar data={incomeChartData} options={{ responsive: true }} />
          </div>

          {/* Expenditure Chart */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Expenditure Overview</h3>
            <Bar data={expenditureChartData} options={{ responsive: true }} />
          </div>

          {/* Combined Radial Progress */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Income vs Expenditure</h3>
            <div className="flex justify-around items-center">
              <div className="w-36">
                <CircularProgressbar
                  value={(totalIncome / (totalIncome + totalExpenditure)) * 100 || 0}
                  text={`${((totalIncome / (totalIncome + totalExpenditure)) * 100 || 0).toFixed(1)}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: `rgba(75, 192, 192, 0.6)`,
                    textColor: '#4b4b4b',
                  })}
                />
                <p className="text-center mt-2 text-green-600">Income</p>
              </div>
              <div className="w-36">
                <CircularProgressbar
                  value={(totalExpenditure / (totalIncome + totalExpenditure)) * 100 || 0}
                  text={`${((totalExpenditure / (totalIncome + totalExpenditure)) * 100 || 0).toFixed(1)}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: `rgba(255, 99, 132, 0.6)`,
                    textColor: '#4b4b4b',
                  })}
                />
                <p className="text-center mt-2 text-red-600">Expenditure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
