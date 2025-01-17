import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Church Finance</h1>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:underline">Dashboard</Link></li>
          <li><Link to="/income" className="hover:underline">Income</Link></li>
          <li><Link to="/expenditure" className="hover:underline">Expenditure</Link></li>
          <li><Link to="/reports" className="hover:underline">Reports</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
