import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Sidebar replaces Navbar
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="w-full max-w-md sm:max-w-2xl md:max-w-4xl mx-auto">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;
