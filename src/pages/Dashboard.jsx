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
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4 text-center">Dashboard</h1>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <p className="text-lg text-gray-700 mb-2">
          Welcome back, <span className="font-semibold text-blue-600">{userName}</span>!
        </p>
        <p className="text-gray-600">
          Explore the Church Financial Management System to manage finances, monitor expenditures, and generate detailed reports efficiently.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 text-center">
          <h2 className="font-bold text-lg lg:text-xl mb-2">Income</h2>
          <p className="text-sm lg:text-base">Manage income records and voteheads.</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-md hover:bg-green-700 transition duration-200 text-center">
          <h2 className="font-bold text-lg lg:text-xl mb-2">Expenditure</h2>
          <p className="text-sm lg:text-base">Track expenses and manage expenditure details.</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200 text-center">
          <h2 className="font-bold text-lg lg:text-xl mb-2">Reports</h2>
          <p className="text-sm lg:text-base">Generate and analyze financial reports.</p>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded-lg shadow-md hover:bg-purple-700 transition duration-200 text-center">
          <h2 className="font-bold text-lg lg:text-xl mb-2">Voteheads</h2>
          <p className="text-sm lg:text-base">Manage voteheads for proper financial allocation.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
