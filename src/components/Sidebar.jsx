import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaBars, FaSignOutAlt, FaHome, FaFileInvoiceDollar, FaChartPie, FaClipboardList } from 'react-icons/fa';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false); // Sidebar toggle state
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
    <div className={`flex ${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-teal-700 to-indigo-900 text-white flex-col min-h-screen shadow-lg transition-all duration-300`}>
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 text-white hover:text-teal-300 focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <FaBars />
      </button>

      {/* Logo Section */}
      <div className={`flex items-center justify-center py-6 border-b border-indigo-700 ${collapsed ? 'hidden' : ''}`}>
        <h1 className="text-2xl font-extrabold tracking-wide">ACK Kamune</h1>
      </div>

      {/* User Info Section */}
      <div className={`flex items-center p-4 border-b border-indigo-700 ${collapsed ? 'justify-center' : ''}`}>
        <FaUserCircle className="text-4xl" />
        {!collapsed && (
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
        )}
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
            onClick={() => setCollapsed(false)}
          >
            {item.icon}
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer Section */}
      <div className={`p-4 border-t border-indigo-700 ${collapsed ? 'hidden' : ''}`}>
        <p className="text-sm text-teal-300 text-center">
          Financial Management System
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
