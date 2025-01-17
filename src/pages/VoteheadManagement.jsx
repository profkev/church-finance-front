import React from 'react';
import VoteheadForm from '../components/VoteheadForm'; // Import your form component

const VoteheadManagement = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Votehead Management</h1>
      <VoteheadForm /> {/* Render the form */}
    </div>
  );
};

export default VoteheadManagement;
