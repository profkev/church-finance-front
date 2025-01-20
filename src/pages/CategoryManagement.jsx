import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm'; // Import your form component

const CategoryManagement = () => {
  const navigate = useNavigate();

  // Redirect to login if the user is not logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      <div className="bg-blue-50 p-4 shadow-md">
        <h1 className="text-3xl font-bold text-blue-700">Expenditure Category Management</h1>
      </div>
      <div className="flex-grow overflow-y-auto p-6">
        <CategoryForm /> {/* Render the form */}
      </div>
    </div>
  );
};

export default CategoryManagement;
