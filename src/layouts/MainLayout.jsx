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
      <main className="flex-1 w-full overflow-x-hidden flex flex-col">
        <div className="flex-1 w-full max-w-md sm:max-w-2xl md:max-w-4xl mx-auto px-4 py-6">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;
