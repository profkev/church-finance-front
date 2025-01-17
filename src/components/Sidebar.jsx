import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaHome, FaFileInvoiceDollar, FaChartPie, FaClipboardList, FaChevronDown } from 'react-icons/fa';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // Sidebar toggle state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  // Handle screen size change
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setCollapsed(false); // Ensure sidebar is expanded on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="relative">
      {/* Header Toggle Button (Chevron for Mobile View) */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`p-3 text-white bg-teal-700 hover:bg-teal-500 focus:outline-none fixed top-0 left-0 w-full h-12 flex items-center justify-center z-50 shadow-md transition duration-300`}
          aria-label="Toggle Sidebar"
        >
          <FaChevronDown size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`flex flex-col ${isMobile ? 'fixed top-12 left-0 h-full w-64 bg-gradient-to-b from-teal-700 to-indigo-900 z-40 text-white shadow-lg transform transition-transform duration-300'
          : 'min-h-screen w-64 bg-gradient-to-b from-teal-700 to-indigo-900 text-white shadow-lg relative'}
          ${collapsed && isMobile ? '-translate-x-full' : 'translate-x-0'}`}
      >
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
              className="text-sm text-teal-300 hover:text-teal-500 flex items-center space-x-1 mt-2"
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
              onClick={() => isMobile && setCollapsed(true)} // Collapse sidebar after clicking a link
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-indigo-700">
          <p className="text-sm text-teal-300 text-center">
            Financial Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
