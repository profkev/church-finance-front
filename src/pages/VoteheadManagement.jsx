import React from 'react';
import VoteheadForm from '../components/VoteheadForm'; // Import your form component

const VoteheadManagement = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      <div className="bg-blue-50 p-4 shadow-md">
        <h1 className="text-3xl font-bold text-blue-700">Income Categoty Management</h1>
      </div>
      <div className="flex-grow overflow-y-auto p-6">
        <VoteheadForm /> {/* Render the form */}
      </div>
    </div>
  );
};

export default VoteheadManagement;
