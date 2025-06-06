import React from 'react';
import RevenueSourceForm from '../components/RevenueSourceForm';

const RevenueSourceManagement = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      <div className="bg-blue-50 p-4 shadow-md">
        <h1 className="text-3xl font-bold text-blue-700">Revenue Source Management</h1>
      </div>
      <div className="flex-grow overflow-y-auto p-6">
        <RevenueSourceForm />
      </div>
    </div>
  );
};

export default RevenueSourceManagement; 