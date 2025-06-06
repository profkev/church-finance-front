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
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [incomeData, setIncomeData] = useState([]);
  const [expenditureData, setExpenditureData] = useState([]);
  const [revenueSources, setRevenueSources] = useState([]);
  const [voteheads, setVoteheads] = useState([]);
  const [recentIncomes, setRecentIncomes] = useState([]);
  const [recentExpenditures, setRecentExpenditures] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [monthlyExpenditure, setMonthlyExpenditure] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      navigate('/login');
    } else {
      setUserName(user.name || 'Guest');
      fetchSummaryData();
      fetchRevenueSources();
      fetchVoteheads();
      fetchRecentTransactions();
      fetchMonthlyTrends();
    }
  }, [navigate]);

  const fetchSummaryData = async () => {
    try {
      // Set date range: start of year to today
      const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10);
      const endDate = new Date().toISOString().slice(0, 10);
      const incomeResponse = await API.get('/api/reports/aggregated-reports', {
        params: { type: 'income', startDate, endDate }
      });
      const expenditureResponse = await API.get('/api/reports/aggregated-reports', {
        params: { type: 'expenditure', startDate, endDate }
      });
      setIncomeData(incomeResponse.data.aggregatedData || []);
      setExpenditureData(expenditureResponse.data.aggregatedData || []);
      setTotalIncome(incomeResponse.data.aggregatedData.reduce((sum, item) => sum + item.totalAmount, 0));
      setTotalExpenditure(expenditureResponse.data.aggregatedData.reduce((sum, item) => sum + item.totalAmount, 0));
    } catch (error) {
      console.error('Error fetching summary data:', error.message);
    }
  };

  const fetchRevenueSources = async () => {
    try {
      const response = await API.get('/api/revenue-sources', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRevenueSources(response.data.revenueSources || []);
    } catch (error) {
      console.error('Error fetching revenue sources:', error.message);
    }
  };

  const fetchVoteheads = async () => {
    try {
      const response = await API.get('/api/voteheads', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setVoteheads(response.data.voteheads || []);
    } catch (error) {
      console.error('Error fetching voteheads:', error.message);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const incomeRes = await API.get('/api/incomes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const expenditureRes = await API.get('/api/expenditures', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRecentIncomes((incomeRes.data.incomes || []).slice(-5).reverse());
      setRecentExpenditures((expenditureRes.data.expenditures || []).slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching recent transactions:', error.message);
    }
  };

  const fetchMonthlyTrends = async () => {
    try {
      // Fetch all incomes and expenditures
      const incomeRes = await API.get('/api/incomes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const expenditureRes = await API.get('/api/expenditures', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Group by month
      const groupByMonth = (arr, dateField) => {
        const months = {};
        arr.forEach(item => {
          const date = new Date(item[dateField] || item.createdAt);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          if (!months[key]) months[key] = 0;
          months[key] += item.amount;
        });
        return months;
      };
      setMonthlyIncome(groupByMonth(incomeRes.data.incomes || [], 'createdAt'));
      setMonthlyExpenditure(groupByMonth(expenditureRes.data.expenditures || [], 'createdAt'));
    } catch (error) {
      console.error('Error fetching monthly trends:', error.message);
    }
  };

  // Pie chart for income by revenue source
  const incomePieData = {
    labels: incomeData.map((item) => item.name || 'N/A'),
    datasets: [
      {
        label: 'Income by Revenue Source',
        data: incomeData.map((item) => item.totalAmount),
        backgroundColor: [
          '#4fd1c5', '#4299e1', '#f6ad55', '#fc8181', '#9f7aea', '#68d391', '#f687b3', '#ed8936', '#38b2ac', '#ecc94b',
        ],
      },
    ],
  };

  // Pie chart for expenditure by votehead
  const expenditurePieData = {
    labels: expenditureData.map((item) => item.name || 'N/A'),
    datasets: [
      {
        label: 'Expenditure by Votehead',
        data: expenditureData.map((item) => item.totalAmount),
        backgroundColor: [
          '#fc8181', '#f6ad55', '#4fd1c5', '#4299e1', '#9f7aea', '#68d391', '#f687b3', '#ed8936', '#38b2ac', '#ecc94b',
        ],
      },
    ],
  };

  // Bar chart for monthly trends
  const months = Array.from(new Set([
    ...Object.keys(monthlyIncome),
    ...Object.keys(monthlyExpenditure),
  ])).sort();
  const monthlyBarData = {
    labels: months.map((key) => {
      const [year, month] = key.split('-');
      return `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
    }),
    datasets: [
      {
        label: 'Income',
        data: months.map((key) => monthlyIncome[key] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Expenditure',
        data: months.map((key) => monthlyExpenditure[key] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const netBalance = totalIncome - totalExpenditure;

  return (
    <div className="h-screen flex flex-col">
      {/* Greeting and Quick Links */}
      <div className="bg-blue-50 p-2 sm:p-4 shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2 md:mb-0 text-center md:text-left">Welcome, {userName}!</h1>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto items-center justify-center">
            <Link to="/income" className="bg-blue-600 text-white w-full sm:w-auto px-4 py-2 rounded shadow hover:bg-blue-700 transition text-center">Add Income</Link>
            <Link to="/expenditure" className="bg-green-600 text-white w-full sm:w-auto px-4 py-2 rounded shadow hover:bg-green-700 transition text-center">Add Expenditure</Link>
            <Link to="/revenue-sources" className="bg-purple-600 text-white w-full sm:w-auto px-4 py-2 rounded shadow hover:bg-purple-700 transition text-center">Manage Revenue Sources</Link>
            <Link to="/voteheads" className="bg-yellow-500 text-white w-full sm:w-auto px-4 py-2 rounded shadow hover:bg-yellow-600 transition text-center">Manage Voteheads</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-2 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-blue-100 pb-24 mt-16 sm:mt-0 mr-8 sm:mr-0">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6 px-2 sm:px-0">
          <div className="bg-green-100 p-3 sm:p-6 rounded-lg shadow-md flex flex-col items-center w-full mx-auto text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-green-700">Total Income</h2>
            <p className="text-2xl sm:text-3xl font-bold text-green-800 mt-2">KES {totalIncome.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">from {revenueSources.length} Revenue Sources</p>
          </div>
          <div className="bg-red-100 p-3 sm:p-6 rounded-lg shadow-md flex flex-col items-center w-full mx-auto text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-red-700">Total Expenditure</h2>
            <p className="text-2xl sm:text-3xl font-bold text-red-800 mt-2">KES {totalExpenditure.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">across {voteheads.length} Voteheads</p>
          </div>
          <div className={`p-3 sm:p-6 rounded-lg shadow-md flex flex-col items-center w-full mx-auto text-center ${netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}> 
            <h2 className={`text-lg sm:text-xl font-semibold ${netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>{netBalance >= 0 ? 'Net Surplus' : 'Net Deficit'}</h2>
            <p className={`text-2xl sm:text-3xl font-bold ${netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'} mt-2`}>KES {netBalance.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">(Income - Expenditure)</p>
          </div>
          <div className="bg-gray-100 p-3 sm:p-6 rounded-lg shadow-md flex flex-col items-center w-full mx-auto text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Sources & Voteheads</h2>
            <p className="text-base sm:text-lg font-bold text-gray-800 mt-2">{revenueSources.length} Revenue Sources</p>
            <p className="text-base sm:text-lg font-bold text-gray-800">{voteheads.length} Voteheads</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 px-2 sm:px-0">
          {/* Income Pie Chart */}
          <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col items-center w-full mx-auto min-w-0 text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">Income by Revenue Source</h3>
            <div className="w-full max-w-[220px] sm:max-w-[300px] h-[140px] sm:h-[220px] mx-auto">
              <Pie data={incomePieData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
          {/* Expenditure Pie Chart */}
          <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md flex flex-col items-center w-full mx-auto min-w-0 text-center">
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">Expenditure by Votehead</h3>
            <div className="w-full max-w-[220px] sm:max-w-[300px] h-[140px] sm:h-[220px] mx-auto">
              <Pie data={expenditurePieData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Monthly Trends Bar Chart */}
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6 flex flex-col items-center w-full mx-auto min-w-0 px-2 sm:px-0 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">Monthly Income & Expenditure Trends</h3>
          <div className="w-full max-w-[320px] sm:max-w-[500px] h-[160px] sm:h-[260px] mx-auto">
            <Bar data={monthlyBarData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md mb-4 sm:mb-6 overflow-x-auto w-full px-2 sm:px-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">Recent Transactions</h3>
          <table className="min-w-full border border-gray-300 text-xs sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 sm:px-4 py-2 border">Date</th>
                <th className="px-2 sm:px-4 py-2 border">Type</th>
                <th className="px-2 sm:px-4 py-2 border">Source/Votehead</th>
                <th className="px-2 sm:px-4 py-2 border">Amount</th>
                <th className="px-2 sm:px-4 py-2 border">Description</th>
              </tr>
            </thead>
            <tbody>
              {[...recentIncomes.map(i => ({
                ...i,
                type: 'Income',
                label: i.revenueSource?.name || 'N/A',
                date: i.createdAt,
              })),
              ...recentExpenditures.map(e => ({
                ...e,
                type: 'Expenditure',
                label: e.votehead?.name || 'N/A',
                date: e.createdAt,
              }))]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map((item, idx) => (
                  <tr key={idx} className={item.type === 'Income' ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-2 sm:px-4 py-2 border">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-2 sm:px-4 py-2 border font-semibold">{item.type}</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.label}</td>
                    <td className="px-2 sm:px-4 py-2 border text-right">{item.amount}</td>
                    <td className="px-2 sm:px-4 py-2 border">{item.description}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Combined Radial Progress */}
        <div className="bg-white p-2 sm:p-6 rounded-lg shadow-md flex flex-col items-center w-full mx-auto min-w-0 px-2 sm:px-0 text-center">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4">Income vs Expenditure</h3>
          <div className="flex flex-col sm:flex-row justify-around items-center w-full gap-4">
            <div className="w-24 sm:w-36">
              <CircularProgressbar
                value={(totalIncome / (totalIncome + totalExpenditure)) * 100 || 0}
                text={`${((totalIncome / (totalIncome + totalExpenditure)) * 100 || 0).toFixed(1)}%`}
                styles={buildStyles({
                  textSize: '14px',
                  pathColor: `rgba(75, 192, 192, 0.6)`,
                  textColor: '#4b4b4b',
                })}
              />
              <p className="text-center mt-2 text-green-600 text-xs sm:text-base">Income</p>
            </div>
            <div className="w-24 sm:w-36">
              <CircularProgressbar
                value={(totalExpenditure / (totalIncome + totalExpenditure)) * 100 || 0}
                text={`${((totalExpenditure / (totalIncome + totalExpenditure)) * 100 || 0).toFixed(1)}%`}
                styles={buildStyles({
                  textSize: '14px',
                  pathColor: `rgba(255, 99, 132, 0.6)`,
                  textColor: '#4b4b4b',
                })}
              />
              <p className="text-center mt-2 text-red-600 text-xs sm:text-base">Expenditure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
