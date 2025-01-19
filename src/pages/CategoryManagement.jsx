import React from 'react';
import CategoryForm from '../components/CategoryForm'; // Import your form component

const VoteheadManagement = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Category Management</h1>
      <CategoryForm /> {/* Render the form */}
    </div>
  );
};

export default VoteheadManagement;
