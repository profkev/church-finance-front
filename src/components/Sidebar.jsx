import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaUserCircle,
  FaBars,
  FaSignOutAlt,
  FaHome,
  FaFileInvoiceDollar,
  FaChartPie,
  FaClipboardList,
} from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Sidebar toggle state for mobile
  const navigate = useNavigate();
  const location = useLocation();
  const userName = JSON.parse(localStorage.getItem('user'))?.name || 'Guest';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/income', label: 'Income', icon: <FaFileInvoiceDollar /> },
    { path: '/expenditure', label: 'Expenditure', icon: <FaChartPie /> },
    { path: '/reports', label: 'Reports', icon: <FaClipboardList /> },
    { path: '/voteheads', label: 'Voteheads', icon: <FaClipboardList /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Navbar */}
      <div className="md:hidden bg-gradient-to-r from-teal-700 to-indigo-900 text-white flex justify-between items-center p-4 shadow-lg">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white hover:text-teal-300 focus:outline-none"
          aria-label="Toggle Navbar"
        >
          <FaBars size={24} />
        </button>
        <h1 className="text-xl font-extrabold">ACK Kamune</h1>
        <FaUserCircle size={24} />
      </div>

      {/* Sidebar for Desktop or Dropdown Menu for Mobile */}
      <div className={`md:flex flex-col bg-gradient-to-b from-teal-700 to-indigo-900 text-white w-64 md:w-64 lg:w-64 shadow-lg transition-all duration-300 ${isOpen ? 'block' : 'hidden md:block'}`}>
        {/* Logo Section */}
        <div className="flex items-center justify-center py-6 border-b border-indigo-700">
          <h1 className="text-2xl font-extrabold tracking-wide">ACK Kamune</h1>
        </div>

        {/* User Info Section */}
        <div className="flex items-center p-4 border-b border-indigo-700">
          <FaUserCircle className="text-4xl" />
          <div className="ml-3">
            <h3 className="font-semibold text-lg">{userName}</h3>
            <button
              onClick={handleLogout}
              className="text-sm text-teal-300 hover:text-teal-500 flex items-center space-x-1"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-grow space-y-2 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 py-3 px-4 rounded-lg ${
                location.pathname === item.path
                  ? 'bg-teal-600 shadow-lg'
                  : 'hover:bg-teal-500 hover:shadow-md'
              } transition-all duration-200`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-indigo-700">
          <p className="text-sm text-teal-300 text-center">Financial Management System</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
