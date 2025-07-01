import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Sidebar replaces Navbar
import Footer from '../components/Footer';

const MainLayout = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden flex flex-col">
        <div className="flex-1 w-full ml-0 md:ml-64 w-full md:w-[calc(100vw-16rem)] px-4 py-6 pt-16">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default MainLayout;
