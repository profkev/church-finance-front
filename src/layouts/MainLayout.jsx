import React from 'react';
import Sidebar from '../components/Sidebar'; // Sidebar replaces Navbar
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-grow p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
