import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking the token
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      // If no token or user data, redirect to login
      navigate('/login');
    } else {
      // Set the user's name if logged in
      setUserName(user.name || 'Guest');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col min-h-screen shadow-lg">
        <div className="flex items-center justify-center py-6 border-b border-blue-700">
          <h1 className="text-2xl font-bold tracking-wide">Church Finance</h1>
        </div>

        {/* User Info Section */}
        <div className="flex items-center p-4 border-b border-blue-700">
          <div className="ml-3">
            <h3 className="font-semibold">{userName}</h3>
            <p className="text-sm text-blue-300">Logged In</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-grow">
          <button className="py-3 px-6 hover:bg-blue-700 transition duration-200">
            Dashboard
          </button>
          <button className="py-3 px-6 hover:bg-blue-700 transition duration-200">
            Income
          </button>
          <button className="py-3 px-6 hover:bg-blue-700 transition duration-200">
            Expenditure
          </button>
          <button className="py-3 px-6 hover:bg-blue-700 transition duration-200">
            Reports
          </button>
          <button className="py-3 px-6 hover:bg-blue-700 transition duration-200">
            Manage Voteheads
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">Dashboard</h1>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-700 mb-2">
            Welcome back, <span className="font-semibold text-blue-600">{userName}</span>!
          </p>
          <p className="text-gray-600">
            Explore the Church Financial Management System to manage finances, monitor expenditures, and generate detailed reports efficiently.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
            <h2 className="font-bold text-xl mb-2">Income</h2>
            <p>Manage income records and voteheads.</p>
          </div>
          <div className="bg-green-600 text-white p-4 rounded-lg shadow-md hover:bg-green-700 transition duration-200">
            <h2 className="font-bold text-xl mb-2">Expenditure</h2>
            <p>Track expenses and manage expenditure details.</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200">
            <h2 className="font-bold text-xl mb-2">Reports</h2>
            <p>Generate and analyze financial reports.</p>
          </div>
          <div className="bg-purple-600 text-white p-4 rounded-lg shadow-md hover:bg-purple-700 transition duration-200">
            <h2 className="font-bold text-xl mb-2">Voteheads</h2>
            <p>Manage voteheads for proper financial allocation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
