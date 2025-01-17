import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import API from '../utils/apiConfig';

const Navbar = () => {
  const [userName, setUserName] = useState(''); // Placeholder for the logged-in user's name
  const navigate = useNavigate();

  // Fetch logged-in user's name
  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserName('Guest');
        return;
      }
      const response = await API.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data.name); // Dynamically set the user's name
    } catch (error) {
      console.error('Error fetching user name:', error.response?.data?.message || error.message);
      setUserName('Guest');
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to the login page
  };

  // Fetch the user's name when the component mounts
  useEffect(() => {
    fetchUserName();
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Brand */}
        <h1 className="text-2xl font-extrabold tracking-wide">
          <Link to="/" className="hover:text-pink-200 transition duration-200">
            Church Finance
          </Link>
        </h1>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className="hover:text-pink-200 font-medium tracking-wide transition duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/income"
            className="hover:text-pink-200 font-medium tracking-wide transition duration-200"
          >
            Income
          </Link>
          <Link
            to="/expenditure"
            className="hover:text-pink-200 font-medium tracking-wide transition duration-200"
          >
            Expenditure
          </Link>
          <Link
            to="/reports"
            className="hover:text-pink-200 font-medium tracking-wide transition duration-200"
          >
            Reports
          </Link>
          <Link
            to="/voteheads"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Manage Votehead
          </Link>
        </div>

        {/* User Info and Logout */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-3xl" />
            <span className="text-lg font-semibold">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            className="text-white focus:outline-none"
            id="mobile-menu-button"
            onClick={() => {
              const menu = document.getElementById('mobile-menu');
              menu.classList.toggle('hidden');
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden bg-purple-700 text-white md:hidden">
        <div className="flex flex-col items-start p-4 space-y-3">
          <Link
            to="/"
            className="hover:text-pink-200 font-medium tracking-wide transition duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/income"
            className="hover:text-pink-200 font-medium tracking-wide transition duration-200"
          >
            Income
          </Link>
          <Link
            to="/expenditure"
            className="hover:text-pink-200 font-medium tracking-wide transition duration-200"
          >
            Expenditure
          </Link>
          <Link
            to="/reports"
            className="hover:text-pink-200 font-medium tracking-wide transition duration-200"
          >
            Reports
          </Link>
          <Link
            to="/voteheads"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded transition duration-200 w-full text-center"
          >
            Manage Votehead
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-200 w-full text-center"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
